import { Star, Clock, DollarSign } from "lucide-react";

interface ServiceCardProps {
  name: string;
  price: string;
  duration: string;
  rating?: number;
  description?: string;
  image?: string;
  popular?: boolean;
}

const ServiceCard = ({ name, price, duration, rating, description, image, popular }: ServiceCardProps) => {
  return (
    <div className="group relative rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-all duration-300 hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 animate-fadeIn">
      {popular && (
        <div className="absolute -top-2 left-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
          Mais popular
        </div>
      )}
      
      <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-3xl sm:text-4xl opacity-20 transition-transform duration-300 group-hover:scale-110">✂️</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-white">{name}</h3>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm text-neutral-300">{rating}</span>
            </div>
          )}
        </div>

        {description && (
          <p className="text-sm text-neutral-400">{description}</p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-300">{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-neutral-500" />
              <span className="text-sm font-semibold text-amber-400">{price}</span>
            </div>
          </div>
          
          <button className="w-full sm:w-auto rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-amber-400 hover:scale-105 active:scale-95">
            Agendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;