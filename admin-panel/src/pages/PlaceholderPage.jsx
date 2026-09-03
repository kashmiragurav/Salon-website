function PlaceholderPage({
  title,
  description = "Module coming soon",
}) {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-[#e9ddd6] bg-white/80 p-8 shadow-sm backdrop-blur-sm">
      <div className="max-w-xl text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e7df] text-xl font-semibold text-[#5b1f2a]">
          ✦
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h2>

        <p className="mt-3 text-base text-slate-600 md:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

export default PlaceholderPage;
