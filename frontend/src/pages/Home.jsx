import { Link } from 'react-router-dom';
import ServiceCard from '../components/ui/ServiceCard';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t("services.education.title"),
      description: t("services.education.desc"),
      icon: "🎓",
      link: "/education-training"
    },
    {
      title: t("services.healthcare.title"),
      description: t("services.healthcare.desc"),
      icon: "🏥",
      link: "/healthcare-support"
    },
    {
      title: t("services.community.title"),
      description: t("services.community.desc"),
      icon: "👥",
      link: "/community"
    },
    {
      title: t("services.government.title"),
      description: t("services.government.desc"),
      icon: "🏛️",
      link: "/government-programs"
    },
    {
      title: t("services.legal.title"),
      description: t("services.legal.desc"),
      icon: "⚖️",
      link: "/legal-rights"
    },
    {
      title: t("services.emergency.title"),
      description: t("services.emergency.desc"),
      icon: "🚨",
      link: "/emergency-services"
    }
  ];

  return (
    <div className="container py-5">
      {/* === Hero Section === */}
      <section className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">{t("home.title")}</h1>
        <p className="lead mb-4">{t("home.subtitle")}</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/contact" className="btn btn-primary btn-lg px-4">
            {t("buttons.contact")}
          </Link>
          <Link to="/community" className="btn btn-success btn-lg px-4">
            {t("buttons.join")}
          </Link>
        </div>
      </section>

      {/* === Services Grid === */}
      <section className="mb-5">
        <h2 className="text-center h3 fw-bold mb-4">{t("home.servicesTitle")}</h2>
        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
              />
            </div>
          ))}
        </div>
      </section>

      {/* === How We Help Section === */}
      <section className="bg-light p-5 rounded shadow-sm mb-5">
        <h2 className="text-center h3 fw-bold mb-4">{t("home.howWeHelpTitle")}</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="fs-1 mb-3">🔍</div>
            <h5 className="fw-semibold mb-2">{t("help.find.title")}</h5>
            <p className="text-muted">{t("help.find.desc")}</p>
          </div>
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="fs-1 mb-3">🤝</div>
            <h5 className="fw-semibold mb-2">{t("help.connect.title")}</h5>
            <p className="text-muted">{t("help.connect.desc")}</p>
          </div>
          <div className="col-md-4">
            <div className="fs-1 mb-3">📚</div>
            <h5 className="fw-semibold mb-2">{t("help.learn.title")}</h5>
            <p className="text-muted">{t("help.learn.desc")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
