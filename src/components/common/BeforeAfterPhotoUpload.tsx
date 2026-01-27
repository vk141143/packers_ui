import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Eye, Download, Grid, List, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { FlexiblePhotoUpload } from './FlexiblePhotoUpload';

interface BeforeAfterPhotoUploadProps {
  beforePhotos: string[];
  afterPhotos: string[];
  onBeforePhotoAdd: (photoDataUrl: string) => void;
  onAfterPhotoAdd: (photoDataUrl: string) => void;
  onPhotoRemove: (type: 'before' | 'after', index: number) => void;
  jobStatus: string;
  className?: string;
}

export const BeforeAfterPhotoUpload: React.FC<BeforeAfterPhotoUploadProps> = ({
  beforePhotos,
  afterPhotos,
  onBeforePhotoAdd,
  onAfterPhotoAdd,
  onPhotoRemove,
  jobStatus,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<{ type: 'before' | 'after', index: number, url: string } | null>(null);
  const [zoom, setZoom] = useState(1);

  const canTakeBeforePhotos = ['crew-arrived', 'in-progress', 'completed'].includes(jobStatus);
  const canTakeAfterPhotos = ['in-progress', 'completed'].includes(jobStatus);

  const PhotoGrid = ({ photos, type, title, color, canAdd }: {
    photos: string[];
    type: 'before' | 'after';
    title: string;
    color: string;
    canAdd: boolean;
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
            <Camera size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600">
              {type === 'before' ? 'Document initial state' : 'Document completed work'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{photos.length} photos</span>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {viewMode === 'grid' ? <List size={18} /> : <Grid size={18} />}
          </button>
        </div>
      </div>
      
      {canAdd && (
        <div className="mb-6">
          <FlexiblePhotoUpload 
            onPhotoCapture={type === 'before' ? onBeforePhotoAdd : onAfterPhotoAdd}
            userRole="crew"
            type={type}
            buttonText={`Add ${type === 'before' ? 'Before' : 'After'} Photo`}
          />
        </div>
      )}
      
      {photos.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-3'}>
          {photos.map((photo, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group ${viewMode === 'list' ? 'flex items-center gap-4 p-3 bg-gray-50 rounded-xl' : ''}`}
            >
              <img 
                src={photo} 
                alt={`${type} photo ${index + 1}`}
                className={`object-cover rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-all ${
                  viewMode === 'grid' ? 'w-full h-32' : 'w-16 h-16'
                }`}
                onClick={() => setSelectedPhoto({ type, index, url: photo })}
              />
              
              {viewMode === 'list' && (
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{type === 'before' ? 'Before' : 'After'} Photo {index + 1}</p>
                  <p className="text-sm text-gray-500">Tap to view full size</p>
                </div>
              )}
              
              <div className={`absolute ${viewMode === 'grid' ? 'inset-0' : 'top-1 right-1'} ${viewMode === 'grid' ? 'bg-black/0 group-hover:bg-black/20' : ''} rounded-xl transition-all flex items-center justify-center`}>
                {viewMode === 'grid' && (
                  <Eye size={20} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                )}
              </div>
              
              <button 
                onClick={() => onPhotoRemove(type, index)}
                className={`absolute ${viewMode === 'grid' ? '-top-2 -right-2' : 'top-1 right-1'} bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all shadow-lg`}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className={`border-2 border-dashed rounded-xl p-8 text-center ${
          type === 'before' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
        }`}>
          <Camera size={48} className={`mx-auto mb-4 ${
            type === 'before' ? 'text-blue-400' : 'text-green-400'
          }`} />
          <p className={`font-medium ${
            type === 'before' ? 'text-blue-600' : 'text-green-600'
          }`}>
            No {type} photos yet
          </p>
          <p className={`text-sm ${
            type === 'before' ? 'text-blue-500' : 'text-green-500'
          }`}>
            {canAdd ? `Take photos to document the ${type === 'before' ? 'initial state' : 'completed work'}` : 'Photos will be available after arrival'}
          </p>
        </div>
      )}
    </motion.div>
  );

  const PhotoViewer = () => {
    if (!selectedPhoto) return null;
    
    const allPhotos = selectedPhoto.type === 'before' ? beforePhotos : afterPhotos;
    const currentIndex = selectedPhoto.index;
    
    const nextPhoto = () => {
      if (currentIndex < allPhotos.length - 1) {
        setSelectedPhoto({
          ...selectedPhoto,
          index: currentIndex + 1,
          url: allPhotos[currentIndex + 1]
        });
      }
    };
    
    const prevPhoto = () => {
      if (currentIndex > 0) {
        setSelectedPhoto({
          ...selectedPhoto,
          index: currentIndex - 1,
          url: allPhotos[currentIndex - 1]
        });
      }
    };
    
    const downloadPhoto = () => {
      const link = document.createElement('a');
      link.href = selectedPhoto.url;
      link.download = `${selectedPhoto.type}-photo-${selectedPhoto.index + 1}.jpg`;
      link.click();
    };
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedPhoto(null)}
      >
        <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
          {/* Photo */}
          <motion.img 
            key={selectedPhoto.url}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: zoom, opacity: 1 }}
            src={selectedPhoto.url} 
            alt="Photo" 
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ transform: `scale(${zoom})` }}
          />
          
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
            >
              <ZoomOut size={20} />
            </button>
            <button 
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={() => setZoom(1)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={downloadPhoto}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          {allPhotos.length > 1 && (
            <>
              {currentIndex > 0 && (
                <button 
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
                >
                  ←
                </button>
              )}
              {currentIndex < allPhotos.length - 1 && (
                <button 
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
                >
                  →
                </button>
              )}
            </>
          )}
          
          {/* Photo Info */}
          <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
            <span className="text-sm font-medium">
              {selectedPhoto.type === 'before' ? 'Before' : 'After'} Photo {selectedPhoto.index + 1} of {allPhotos.length}
            </span>
          </div>
          
          {/* Thumbnails */}
          {allPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-full">
              {allPhotos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto({ ...selectedPhoto, index: i, url: allPhotos[i] })}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Before Photos */}
      <PhotoGrid 
        photos={beforePhotos}
        type="before"
        title="📸 Before Photos"
        color="from-blue-500 to-cyan-500"
        canAdd={canTakeBeforePhotos}
      />
      
      {/* After Photos */}
      <PhotoGrid 
        photos={afterPhotos}
        type="after"
        title="✅ After Photos"
        color="from-green-500 to-emerald-500"
        canAdd={canTakeAfterPhotos}
      />
      
      {/* Comparison View */}
      {beforePhotos.length > 0 && afterPhotos.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Maximize2 size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">🔄 Before & After Comparison</h3>
              <p className="text-gray-600">Side-by-side view of the transformation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Before</h4>
              <div className="grid grid-cols-2 gap-2">
                {beforePhotos.slice(0, 4).map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`Before ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all"
                    onClick={() => setSelectedPhoto({ type: 'before', index, url: photo })}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">After</h4>
              <div className="grid grid-cols-2 gap-2">
                {afterPhotos.slice(0, 4).map((photo, index) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`After ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all"
                    onClick={() => setSelectedPhoto({ type: 'after', index, url: photo })}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Photo Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && <PhotoViewer />}
      </AnimatePresence>
    </div>
  );
};