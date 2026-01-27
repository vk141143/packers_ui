import { useState, useEffect } from 'react';
import { Job } from '../types';
import { mockJobs } from '../data/mockData';
import { canCompleteJob, canDispatchJob, canVerifyJob } from '../utils/jobLifecycle';
import { generateComplianceReport } from '../utils/complianceReports';
import { generateEnhancedInvoice } from '../utils/billingCalculations';
import { calculateSLADeadline, calculateResponseTime, calculateCompletionTime, isSLABreached } from '../utils/slaCalculations';
import { validateStatusTransition } from '../utils/statusTransitions';

class JobStore {
  private jobs: Job[] = [];
  private jobsMap: Map<string, Job> = new Map();
  private clientJobsIndex: Map<string, Set<string>> = new Map();
  private listeners: Array<() => void> = [];
  private initialized = false;
  private notifyTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (!this.initialized) {
      this.jobs = [...mockJobs];
      this.rebuildIndexes();
      this.initialized = true;
    }
  }

  private rebuildIndexes() {
    this.jobsMap.clear();
    this.clientJobsIndex.clear();
    this.jobs.forEach(job => {
      this.jobsMap.set(job.id, job);
      if (!this.clientJobsIndex.has(job.clientId)) {
        this.clientJobsIndex.set(job.clientId, new Set());
      }
      this.clientJobsIndex.get(job.clientId)!.add(job.id);
    });
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    if (this.notifyTimer) clearTimeout(this.notifyTimer);
    this.notifyTimer = setTimeout(() => {
      this.listeners.forEach(listener => listener());
    }, 100);
  }

  getJobs() {
    return [...this.jobs];
  }

  getJobsByClientId(clientId: string) {
    const jobIds = this.clientJobsIndex.get(clientId);
    if (!jobIds) return [];
    return Array.from(jobIds).map(id => this.jobsMap.get(id)!).filter(Boolean);
  }

  getJobsByRole(role: 'client', userId: string) {
    // Client sees jobs for their user ID
    return this.jobs.filter(job => job.clientId === userId);
  }

  addJob(job: Job) {
    console.log('➕ JobStore: Adding job to store:', job.id, 'clientId:', job.clientId);
    this.jobs.unshift(job);
    this.jobsMap.set(job.id, job);
    if (!this.clientJobsIndex.has(job.clientId)) {
      this.clientJobsIndex.set(job.clientId, new Set());
    }
    this.clientJobsIndex.get(job.clientId)!.add(job.id);
    console.log('📋 JobStore: Total jobs now:', this.jobs.length);
    console.log('📋 JobStore: Client index for', job.clientId, ':', Array.from(this.clientJobsIndex.get(job.clientId) || []));
    this.notify();
  }

  createJob(jobData: Partial<Job>) {
    console.log('🎆 JobStore: Creating job with data:', jobData);
    
    const newJob: Job = {
      id: `JOB-${Date.now()}`,
      immutableReferenceId: `REF-${Date.now()}`,
      clientName: jobData.clientName || 'Unknown Client',
      clientId: jobData.clientId || 'CUST-001',
      clientType: jobData.clientType || 'council',
      serviceType: jobData.serviceType || 'emergency-clearance',
      propertyAddress: jobData.propertyAddress || '',
      pickupAddress: jobData.pickupAddress || jobData.propertyAddress || '',
      scheduledDate: jobData.scheduledDate || new Date().toISOString(),
      slaType: jobData.slaType || '48h',
      slaDeadline: jobData.slaDeadline || new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      slaBreached: false,
      status: 'client-booking-request',  // Step 1: Client booking request
      lifecycleState: 'created',
      estimatedValue: jobData.estimatedValue || 500,
      urgency: jobData.urgency || 'standard',
      proofRequired: jobData.proofRequired || true,
      createdAt: new Date().toISOString(),
      photos: [],
      checklist: [
        { id: '1', task: 'Initial property inspection', completed: false, order: 1 },
        { id: '2', task: 'Pack fragile items', completed: false, order: 2 },
        { id: '3', task: 'Load items into vehicle', completed: false, order: 3 },
        { id: '4', task: 'Transport to destination', completed: false, order: 4 },
        { id: '5', task: 'Unload and arrange items', completed: false, order: 5 },
      ],
      statusHistory: [{
        status: 'client-booking-request',
        timestamp: new Date().toISOString(),
        updatedBy: 'Client',
        notes: 'Booking request submitted - awaiting admin quote'
      }]
    } as Job;
    
    console.log('✅ JobStore: Created job:', newJob);
    console.log('📋 JobStore: Job clientId set to:', newJob.clientId);
    
    this.addJob(newJob);
    return newJob;
  }

  // Prevent quote modification if already accepted
  provideQuote(jobId: string, quoteData: any) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Check if quote is already locked (client has accepted)
    if (job.finalQuote?.locked) {
      return { success: false, error: 'Quote is locked - client has already accepted the pricing' };
    }

    job.quoteDetails = {
      ...quoteData,
      depositAmount: quoteData.depositAmount || 0
    };
    
    // Create enhanced finalQuote structure for client acceptance
    job.finalQuote = {
      fixedPrice: quoteData.quotedAmount,
      depositAmount: quoteData.depositAmount || Math.round(quoteData.quotedAmount * 0.3), // 30% default deposit
      scopeOfWork: quoteData.scopeOfWork || [
        'Initial property assessment and planning',
        'Professional packing and protection of items',
        'Safe loading and transportation',
        'Unloading and placement at destination',
        'Final cleanup and inspection'
      ],
      completionTimeline: quoteData.completionTimeline || '1-2 business days',
      cancellationTerms: quoteData.cancellationTerms || 'Cancellation allowed up to 24 hours before scheduled date. Deposit refundable if cancelled within 48 hours of booking.',
      validUntil: quoteData.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      quotedBy: quoteData.quotedBy,
      quotedAt: quoteData.quotedAt || new Date().toISOString(),
      locked: false // Initially unlocked
    };
    
    job.status = 'admin-quoted';
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'admin-quoted',
      timestamp: new Date().toISOString(),
      updatedBy: quoteData.quotedBy,
      notes: `Quote provided: £${quoteData.quotedAmount}${quoteData.depositAmount ? ` (Deposit: £${quoteData.depositAmount})` : ''}`
    });
    
    this.notify();
    return { success: true };
  }

  // Step 3: Client approves quote - LOCKS THE PRICE
  approveQuote(jobId: string, approvedBy: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Lock the quote - no further price changes allowed
    if (job.finalQuote) {
      job.finalQuote.locked = true;
      job.finalQuote.lockedAt = new Date().toISOString();
    }

    job.clientApproval = {
      approvedAt: new Date().toISOString(),
      approvedBy
    };
    job.status = 'client-approved';
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'client-approved',
      timestamp: new Date().toISOString(),
      updatedBy: approvedBy,
      notes: 'Client approved the quote - price is now locked'
    });
    
    // Move to payment pending
    setTimeout(() => {
      job.status = 'payment-pending';
      job.statusHistory!.push({
        status: 'payment-pending',
        timestamp: new Date().toISOString(),
        updatedBy: 'System',
        notes: 'Awaiting payment from client'
      });
      this.notify();
    }, 100);
    
    this.notify();
    return { success: true };
  }

  // Step 3 Alternative: Client rejects quote
  rejectQuote(jobId: string, reason: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    job.status = 'quote-rejected';
    job.rejectionReason = reason;
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'quote-rejected',
      timestamp: new Date().toISOString(),
      updatedBy: 'Client',
      notes: `Quote rejected: ${reason}`
    });
    
    this.notify();
    return { success: true };
  }

  // Step 4-5: Process payment and confirm booking
  processPayment(jobId: string, paymentData: any) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    job.initialPayment = paymentData;
    job.paymentStatus = 'success';
    job.status = 'booking-confirmed';
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'booking-confirmed',
      timestamp: paymentData.paidAt || new Date().toISOString(),
      updatedBy: 'System',
      notes: `Deposit payment received: ${paymentData.transactionId} - Amount: £${paymentData.amount}`
    });
    
    this.notify();
    return { success: true };
  }

  updateJobs(updatedJobs: Job[]) {
    console.log('📝 JobStore: Updating jobs with:', updatedJobs);
    this.jobs = [...updatedJobs];
    this.rebuildIndexes();
    this.notify();
  }

  updateJobStatus(jobId: string, status: Job['status']) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Validate status transition
    const validation = validateStatusTransition(job.status, status, job);
    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    job.status = status;
    if (status === 'completed') {
      job.completedAt = new Date().toISOString();
    }
    
    // Add to status history
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      updatedBy: 'System',
      notes: `Status updated to ${status}`
    });
    
    this.notify();
    return { success: true };
  }

  updateJob(jobOrId: string | Job, updates?: Partial<Job>) {
    let job: Job | undefined;
    
    if (typeof jobOrId === 'string') {
      // If first parameter is a string, it's a job ID
      job = this.jobsMap.get(jobOrId);
      if (job && updates) {
        Object.assign(job, updates);
        this.notify();
      }
    } else {
      // If first parameter is an object, it's a job object
      job = jobOrId;
      const existingJob = this.jobsMap.get(job.id);
      if (existingJob) {
        Object.assign(existingJob, job);
        this.notify();
      }
    }
  }

  cancelJob(jobId: string, reason: string, cancelledBy: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (job.status === 'cancelled' || job.status === 'completed') {
      return { success: false, error: 'Job cannot be cancelled' };
    }

    const cancelTime = new Date().toISOString();
    job.status = 'cancelled';
    job.lifecycleState = 'completed';
    job.cancelledAt = cancelTime;
    job.cancelledBy = cancelledBy;
    job.cancellationReason = reason;
    
    // Add to status history
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'cancelled',
      timestamp: cancelTime,
      updatedBy: cancelledBy,
      notes: `Job cancelled: ${reason}`
    });

    this.notify();
    return { success: true };
  }

  dispatchJob(jobId: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    const validation = canDispatchJob(job);
    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    const dispatchTime = new Date().toISOString();
    job.lifecycleState = 'dispatched';
    job.dispatchedAt = dispatchTime;
    job.status = 'dispatched';
    job.slaDeadline = calculateSLADeadline(dispatchTime, job.slaType);
    job.responseTimeMinutes = calculateResponseTime(job.createdAt, dispatchTime);
    
    this.notify();
    return { success: true };
  }

  startJob(jobId: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (!job.startedAt) {
      job.startedAt = new Date().toISOString();
    }
    job.lifecycleState = 'in-progress';
    job.status = 'in-progress';  // Step 7
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'in-progress',
      timestamp: new Date().toISOString(),
      updatedBy: 'Crew',
      notes: 'Work started'
    });
    
    this.notify();
    return { success: true };
  }

  // Step 8: Work completed - trigger final payment request
  completeJob(jobId: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    const validation = canCompleteJob(job);
    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    const completionTime = new Date().toISOString();
    job.status = 'work-completed';
    job.completedAt = completionTime;
    
    if (job.startedAt) {
      job.completionTimeMinutes = calculateCompletionTime(job.startedAt, completionTime);
    }
    
    job.slaBreached = isSLABreached(job.slaDeadline, completionTime);

    // Calculate remaining amount for final payment
    const totalAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
    const depositPaid = job.finalQuote?.depositAmount || 0;
    const remainingAmount = totalAmount - depositPaid;
    
    if (remainingAmount > 0) {
      job.finalPrice = remainingAmount;
      job.finalAmountSentAt = completionTime;
      job.paymentStatus = 'pending';
      
      // Auto-request final payment
      this.requestFinalPayment(jobId, remainingAmount);
    } else {
      // If no remaining payment, mark as ready for invoice
      job.paymentStatus = 'success';
      job.paidAt = completionTime;
      
      // Auto-generate invoice
      setTimeout(() => {
        this.generateInvoice(jobId);
      }, 1000);
    }

    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'work-completed',
      timestamp: completionTime,
      updatedBy: 'Crew',
      notes: `Work completed - ${remainingAmount > 0 ? `Final payment of £${remainingAmount} required` : 'Ready for invoice generation'}`
    });

    try {
      generateComplianceReport(job);
      job.reportGenerated = true;
      job.reportUrl = `/reports/${job.immutableReferenceId}_compliance.pdf`;
    } catch (error) {
      console.error('Report generation failed:', error);
    }

    this.notify();
    return { success: true };
  }

  // Step 9: Admin verifies job and sets final price
  verifyJob(jobId: string, finalPrice: number, verifiedBy: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    const validation = canVerifyJob(job);
    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    job.verifiedFinalPrice = finalPrice;
    job.verifiedAt = new Date().toISOString();
    job.verifiedBy = verifiedBy;
    job.status = 'admin-verified';
    
    // Calculate remaining amount after deposit
    const depositPaid = job.finalQuote?.depositAmount || 0;
    const remainingAmount = finalPrice - depositPaid;
    
    job.finalPrice = remainingAmount;
    job.finalAmountSentAt = new Date().toISOString();
    job.paymentStatus = 'pending';
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'admin-verified',
      timestamp: new Date().toISOString(),
      updatedBy: verifiedBy,
      notes: `Job verified with final price: £${finalPrice} (Remaining: £${remainingAmount})`
    });
    
    this.notify();
    return { success: true };
  }

  // Step 10: Request final payment
  // Step 10: Request final payment with notification
  requestFinalPayment(jobId: string, amount: number) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Calculate remaining amount after deposit
    const totalAmount = job.finalQuote?.fixedPrice || job.estimatedValue || 0;
    const depositPaid = job.finalQuote?.depositAmount || 0;
    const remainingAmount = totalAmount - depositPaid;

    job.status = 'final-payment-pending';
    job.finalPayment = {
      amount: remainingAmount,
      paidAt: undefined,
      transactionId: undefined
    };
    
    // Set final price for client notification
    job.finalPrice = remainingAmount;
    job.finalAmountSentAt = new Date().toISOString();
    job.paymentStatus = 'pending';
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'final-payment-pending',
      timestamp: new Date().toISOString(),
      updatedBy: 'Admin',
      notes: `Final payment requested: £${remainingAmount} (Total: £${totalAmount}, Deposit paid: £${depositPaid})`
    });
    
    // Send notification to client (simulate email/SMS)
    this.sendPaymentNotification(job, remainingAmount);
    
    this.notify();
    return { success: true };
  }

  // Send payment notification to client
  private sendPaymentNotification(job: Job, amount: number) {
    console.log(`📧 Payment notification sent to ${job.clientName}:`);
    console.log(`   Job: ${job.immutableReferenceId}`);
    console.log(`   Amount due: £${amount}`);
    console.log(`   Status: Work completed and verified`);
    
    // In real implementation, this would send email/SMS
    // For now, we'll show a success message to admin
  }

  // Process final payment after job completion
  processFinalPayment(jobId: string, paymentData: any) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    job.finalPayment = {
      amount: paymentData.amount,
      paidAt: paymentData.paidAt || new Date().toISOString(),
      transactionId: paymentData.transactionId,
      method: paymentData.method
    };
    job.paymentStatus = 'success';
    job.paidAt = paymentData.paidAt || new Date().toISOString();
    job.paymentId = paymentData.transactionId;
    job.status = 'completed';
    
    // Mark as ready for invoice generation
    job.invoiceGenerated = false;
    job.lifecycleState = 'completed';
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'completed',
      timestamp: job.paidAt,
      updatedBy: 'System',
      notes: `Final payment received: £${paymentData.amount} - Job completed`
    });
    
    // Auto-generate invoice after payment
    setTimeout(() => {
      this.generateInvoice(jobId);
    }, 1000);
    
    this.notify();
    return { success: true };
  }

  // Generate invoice after payment
  generateInvoice(jobId: string) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (job.paymentStatus !== 'success') {
      return { success: false, error: 'Payment must be completed before generating invoice' };
    }

    if (job.invoiceGenerated) {
      return { success: false, error: 'Invoice already generated' };
    }

    // Generate invoice
    const invoiceId = `INV-${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    job.invoiceId = invoiceId;
    job.invoiceGenerated = true;
    job.invoiceStatus = 'generated';
    job.invoiceGeneratedAt = timestamp;
    job.lifecycleState = 'invoiced';

    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'invoiced',
      timestamp,
      updatedBy: 'System',
      notes: `Invoice generated automatically: ${invoiceId}`
    });

    // Send notification to client
    this.sendInvoiceNotification(job);

    this.notify();
    return { success: true, invoiceId };
  }

  // Send invoice notification to client
  private sendInvoiceNotification(job: Job) {
    console.log(`📧 Invoice notification sent to ${job.clientName}:`);
    console.log(`   Invoice ID: ${job.invoiceId}`);
    console.log(`   Job: ${job.immutableReferenceId}`);
    console.log(`   Total Amount: £${job.finalQuote?.fixedPrice || job.estimatedValue}`);
    
    // Update invoice status to sent
    job.invoiceStatus = 'sent';
    job.invoiceSentAt = new Date().toISOString();
  }

  updateJobPhotos(jobId: string, beforePhotos: string[], afterPhotos: string[]) {
    const job = this.jobsMap.get(jobId);
    if (job) {
      if (!job.photos) job.photos = [];
      beforePhotos.forEach(url => {
        job.photos!.push({
          id: Date.now().toString() + Math.random(),
          url,
          type: 'before',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Crew Member'
        });
      });
      afterPhotos.forEach(url => {
        job.photos!.push({
          id: Date.now().toString() + Math.random(),
          url,
          type: 'after',
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Crew Member'
        });
      });
      this.notify();
    }
  }

  assignCrew(jobId: string, crewIds: string[], crewNames: string[], crewDetails?: any[], clientDetails?: any) {
    const job = this.jobsMap.get(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    // Validate status transition
    const validation = validateStatusTransition(job.status, 'crew-assigned', { crewIds });
    if (!validation.allowed) {
      return { success: false, error: validation.reason };
    }

    job.crewAssigned = crewNames;
    job.crewIds = crewIds;
    job.assignedCrewDetails = crewDetails;
    job.clientDetails = clientDetails;
    job.lifecycleState = 'assigned';
    job.status = 'crew-assigned';  // Step 6
    
    if (!job.statusHistory) job.statusHistory = [];
    job.statusHistory.push({
      status: 'crew-assigned',
      timestamp: new Date().toISOString(),
      updatedBy: 'Admin',
      notes: `Crew assigned: ${crewNames.join(', ')}`
    });
    
    this.notify();
    return { success: true };
  }

  updateChecklist(jobId: string, checklist: any[]) {
    const job = this.jobsMap.get(jobId);
    if (job) {
      job.checklist = checklist;
      this.notify();
    }
  }

  getJobById(jobId: string) {
    return this.jobsMap.get(jobId);
  }
}

export const jobStore = new JobStore();

export const useJobStore = () => {
  const [jobs, setJobs] = useState<Job[]>(jobStore.getJobs());
  
  useEffect(() => {
    const unsubscribe = jobStore.subscribe(() => {
      setJobs(jobStore.getJobs());
    });
    return unsubscribe;
  }, []);
  
  return {
    jobs,
    getJobById: (id: string) => jobStore.getJobById(id),
    getJobsByClientId: (clientId: string) => jobStore.getJobsByClientId(clientId),
    createJob: (jobData: Partial<Job>) => jobStore.createJob(jobData),
    updateJob: (jobId: string, updates: Partial<Job>) => jobStore.updateJob(jobId, updates),
    updateJobStatus: (jobId: string, status: Job['status']) => jobStore.updateJobStatus(jobId, status),
    processPayment: (jobId: string, paymentData: any) => jobStore.processPayment(jobId, paymentData),
    processFinalPayment: (jobId: string, paymentData: any) => jobStore.processFinalPayment(jobId, paymentData)
  };
};
