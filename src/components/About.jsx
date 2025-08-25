import "./About.css";

function About({ onClose, language }) {
  const translations = {
    en: {
      about: "About",
      aboutText:
        "Listado is built to be as simple as a paper shopping list — anyone can use it. Just create a list, share the link, and start adding items together in real time. No account needed.\n\nIf you want to save and revisit your past lists, you can create a free account — otherwise, everything works instantly without sign-ups or complications.",
      close: "Close",
    },
    ro: {
      about: "Despre",
      aboutText:
        "Listado este construit să fie la fel de simplu ca o listă de cumpărături pe hârtie — oricine îl poate folosi. Doar creează o listă, trimite linkul și începe să adaugi produse împreună în timp real. Nu este nevoie de cont.\n\nDacă vrei să salvezi și să revizitezi listele tale anterioare, poți crea un cont gratuit — altfel, totul funcționează instant fără înregistrări sau complicații.",
      close: "Închide",
    },
    es: {
      about: "Acerca de",
      aboutText:
        "Listado está construido para ser tan simple como una lista de compras en papel — cualquiera puede usarlo. Solo crea una lista, comparte el enlace y comienza a agregar elementos juntos en tiempo real. No se necesita cuenta.\n\nSi quieres guardar y revisitar tus listas anteriores, puedes crear una cuenta gratuita — de lo contrario, todo funciona instantáneamente sin registros o complicaciones.",
      close: "Cerrar",
    },
  };

  const t = translations[language];

  return (
    <div className="about-modal">
      <div className="about-content">
        <div className="about-header">
          <h2>{t.about}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="about-body">
          <p>{t.aboutText}</p>
        </div>
      </div>
    </div>
  );
}

export default About;
