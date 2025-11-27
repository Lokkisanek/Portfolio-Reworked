import Link from 'next/link';

export default function Landing() {
    return (
        <main className="landing">
            <div className="selector">
                <h1 className="title">Vyber portfólio</h1>

                <div className="buttons">
                    <Link href="/classic" className="btn">Classic Portfolio</Link>
                    <Link href="/visual" className="btn">Visual Portfolio</Link>
                    <Link href="/game" className="btn">Game Portfolio</Link>
                </div>

                <footer className="landing-footer">© {new Date().getFullYear()} My Portfolio</footer>
            </div>
        </main>
    );
}
