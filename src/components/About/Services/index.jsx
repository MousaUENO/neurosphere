const Services = ({ servicesData }) => {
  const ServicesData = servicesData;
  return (
    <div className="services section-padding xl-pl30 xl-pr30">
      <div className="container ">
        <div className="row ">
          {ServicesData.map((service, index) => (
            <div className="col-lg-4 col-md-6 service-box" key={service.id}>
              <div
                className={`item wow fadeInUp ${
                  index !== ServicesData.length - 1 && ""
                }`}
                data-wow-delay={`${0.3 + 0.3}s`}
              >
                <span className={`icon ${service.iconClass}`}></span>
                <h6>{service.title}</h6>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
