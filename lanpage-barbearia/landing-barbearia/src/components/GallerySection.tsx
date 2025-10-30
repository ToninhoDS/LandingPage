import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LazyImage } from '@/components/ui/LazyImage';
import { useResponsive } from '@/hooks/useResponsive';

const GallerySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('gallery-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos os Trabalhos', count: 24 },
    { id: 'cortes', label: 'Cortes Masculinos', count: 12 },
    { id: 'barbas', label: 'Barbas & Bigodes', count: 8 },
    { id: 'desenhos', label: 'Desenhos Artísticos', count: 4 }
  ];

  const galleryItems = [
    {
      id: 1,
      category: 'cortes',
      title: 'Corte Degradê Moderno',
      description: 'Corte degradê com transição suave e acabamento perfeito',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20fade%20haircut%20men%20professional%20barber%20work%20clean%20sharp%20styling&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=man%20with%20long%20messy%20hair%20before%20haircut%20natural%20lighting&image_size=square_hd'
    },
    {
      id: 2,
      category: 'barbas',
      title: 'Barba Clássica Aparada',
      description: 'Barba bem aparada com contornos definidos',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=well%20groomed%20classic%20beard%20trim%20professional%20barber%20work%20sharp%20lines&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=man%20with%20unkempt%20long%20beard%20before%20grooming%20natural%20lighting&image_size=square_hd'
    },
    {
      id: 3,
      category: 'cortes',
      title: 'Pompadour Estilizado',
      description: 'Corte pompadour com volume e textura',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=stylish%20pompadour%20haircut%20men%20volume%20texture%20professional%20styling&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=man%20with%20flat%20hair%20before%20styling%20natural%20lighting&image_size=square_hd'
    },
    {
      id: 4,
      category: 'desenhos',
      title: 'Desenho Geométrico',
      description: 'Arte capilar com padrões geométricos únicos',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=geometric%20hair%20art%20design%20creative%20barber%20work%20artistic%20patterns&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=simple%20haircut%20before%20artistic%20design%20natural%20lighting&image_size=square_hd'
    },
    {
      id: 5,
      category: 'cortes',
      title: 'Undercut Texturizado',
      description: 'Corte undercut com textura no topo',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=textured%20undercut%20haircut%20men%20modern%20styling%20professional%20barber&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=man%20with%20overgrown%20hair%20before%20undercut%20natural%20lighting&image_size=square_hd'
    },
    {
      id: 6,
      category: 'barbas',
      title: 'Barba Degradê',
      description: 'Barba com degradê suave e contornos precisos',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fade%20beard%20trim%20precise%20lines%20professional%20grooming%20sharp%20edges&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=man%20with%20uneven%20beard%20before%20professional%20trim&image_size=square_hd'
    },
    {
      id: 7,
      category: 'cortes',
      title: 'Buzz Cut Estilizado',
      description: 'Corte militar com detalhes modernos',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=stylized%20buzz%20cut%20modern%20details%20clean%20professional%20barber%20work&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=man%20with%20medium%20length%20hair%20before%20buzz%20cut&image_size=square_hd'
    },
    {
      id: 8,
      category: 'desenhos',
      title: 'Logo Personalizado',
      description: 'Desenho de logo personalizado no cabelo',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=custom%20logo%20hair%20design%20artistic%20barber%20work%20creative%20styling&image_size=square_hd',
      beforeImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=plain%20haircut%20before%20logo%20design%20natural%20lighting&image_size=square_hd'
    }
  ];

  const filteredItems = selectedCategory === 'todos' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredItems.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="gallery-section" className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <span className="px-6 py-3 bg-amber-400/15 text-amber-300 text-lg font-semibold rounded-full border border-amber-400/30 backdrop-blur-sm inline-block mb-8">
              🎨 Nossos Trabalhos
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Galeria de
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Transformações
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Cada corte conta uma história. Veja como transformamos o visual dos nossos clientes 
              com técnica, criatividade e muito estilo.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className={`flex flex-wrap justify-center gap-4 mb-16 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold shadow-lg shadow-amber-500/30'
                  : 'border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              {category.label}
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className={`grid ${
          isMobile ? 'grid-cols-2 gap-4' : 
          isTablet ? 'grid-cols-3 gap-6' : 
          'grid-cols-4 gap-8'
        } transform transition-all duration-1000 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {filteredItems.map((item, index) => (
            <Card 
              key={item.id} 
              className="bg-white/10 backdrop-blur-md border-amber-400/30 overflow-hidden hover:bg-white/15 transition-all duration-500 group cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/20"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden relative">
                <LazyImage
                  src={item.image}
                  alt={item.title}
                  aspectRatio="square"
                  className="w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-amber-400/90 text-black px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Ver Antes/Depois
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transform transition-all duration-1000 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-xl text-gray-300 mb-8">
            Gostou do que viu? Que tal ser o próximo a ter uma transformação incrível?
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold px-12 py-6 text-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-110 transition-all duration-500 shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60"
          >
            Agendar Minha Transformação
          </Button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image content */}
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
              {/* Before */}
              <div className="space-y-4">
                <h3 className="text-white text-xl font-bold text-center">Antes</h3>
                <LazyImage
                  src={filteredItems[selectedImage].beforeImage}
                  alt="Antes"
                  aspectRatio="square"
                  className="w-full rounded-lg"
                />
              </div>
              
              {/* After */}
              <div className="space-y-4">
                <h3 className="text-amber-400 text-xl font-bold text-center">Depois</h3>
                <LazyImage
                  src={filteredItems[selectedImage].image}
                  alt="Depois"
                  aspectRatio="square"
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div className="text-center mt-8">
              <h4 className="text-white text-2xl font-bold mb-4">
                {filteredItems[selectedImage].title}
              </h4>
              <p className="text-gray-300 text-lg">
                {filteredItems[selectedImage].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;