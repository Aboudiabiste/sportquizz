import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Banner gradient */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-zinc-950 to-zinc-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(14,165,233,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(14,165,233,0.1)_0%,_transparent_60%)]" />

        {/* Decorative blurred circles */}
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">⚽</div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Quiz Sport
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Remplis le tableau avant les autres —{' '}
              <span className="text-zinc-500 italic">
                et surtout Arthur ce gros Hmar il pipe rien au ballon mdr
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/lobby/new"
              className="flex-1 bg-sky-500 hover:bg-sky-400 active:scale-95 text-black font-bold py-4 px-6 rounded-2xl text-center text-lg transition-all shadow-lg shadow-sky-900/40"
            >
              Créer une partie
            </Link>
            <Link
              href="/join"
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-bold py-4 px-6 rounded-2xl text-center text-lg transition-all"
            >
              Rejoindre
            </Link>
          </div>

          <p className="text-zinc-700 text-xs">Max 5 joueurs · Gratuit · Aucun compte requis</p>
        </div>
      </div>
    </div>
  )
}
