export default function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Lazy loaded image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="w-full h-full flex items-center justify-center text-4xl"
          style={{ display: product.imageUrl ? "none" : "flex" }}
        >
          🛍️
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 mt-2 truncate">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {product.description || "No description available."}
        </p>
        <p className="text-base font-bold text-gray-900 mt-3">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}