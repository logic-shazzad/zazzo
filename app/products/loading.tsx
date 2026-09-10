export default function ProductsLoading() {
  return (
    <main className="shell min-h-[60vh] animate-pulse py-8 sm:py-12">
      <div className="h-4 w-24 rounded-full bg-slate-200" />
      <div className="mt-5 h-10 w-full max-w-2xl rounded-xl bg-slate-200" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-[28px] border border-slate-100 bg-white p-4">
            <div className="h-56 rounded-2xl bg-slate-100" />
            <div className="mt-5 h-5 w-2/3 rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </main>
  );
}
