export default function ShopError() {
  return (
    <div className="mt-12 rounded-3xl bg-kobbo-white px-6 py-16 text-center shadow-soft">
      <p className="font-heading text-xl font-bold text-kobbo-black">
        Unable to load products
      </p>
      <p className="mt-2 text-sm text-kobbo-muted">
        Please check your connection and try again later.
      </p>
    </div>
  );
}
