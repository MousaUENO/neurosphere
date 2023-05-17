/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import appData from '../../data/app.json';

const Footer = ({ classText }) => {
  return (
    <footer className={ classText ? classText : '' }>
      <div className="container">
          <div className="row">
              <div className="col-lg-4">
                  <div className="item md-mb50">
                      <div className="title">
                          <h5>Contact Us</h5>
                      </div>
                      <ul>
                        <li>
                            <span className="icon pe-7s-map-marker"></span>
                            <div className="cont">
                                <h6>Officeal Address</h6>
                                <p>{ appData.address.street } . { appData.address.city }, { appData.address.state } , { appData.address.country }</p>
                            </div>
                        </li>
                        <li>
                            <span className="icon pe-7s-mail"></span>
                            <div className="cont">
                                <h6>Email Us</h6>
                                <p>{ appData.email }</p>
                            </div>
                        </li>
                        <li>
                            <span className="icon pe-7s-call"></span>
                            <div className="cont">
                                <h6>Call Us</h6>
                                <p>{ appData.phone }</p>
                            </div>
                        </li>
                      </ul>
                  </div>
              </div>
              <div className="col-lg-4">
                  <div className="item md-mb50">
                      <div className="title">
                        <h5>Recent News</h5>
                      </div>
                      <ul>
                          {
                            appData.footerNews.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className="img">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="sm-post">
                                            <p>{ item.title }</p>
                                            <span className="date">{ item.date }</span>
                                        </div>
                                    </li>
                                )
                            })
                          }
                          <li>
                              <div className="subscribe">
                                  <input type="text" placeholder="Type Your Email" />
                                  <span className="subs pe-7s-paper-plane"></span>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
              <div className="col-lg-4">
                  <div className="item">
                      <div className="logo">
                          <img src={appData.lightLogo} alt="" />
                      </div>
                      <div className="social">
                          <Link href="#0">
                            <a><i className="fab fa-facebook-f"></i></a>
                          </Link>
                          <Link href="#0">
                            <a><i className="fab fa-twitter"></i></a>
                          </Link>
                          <Link href="#0">
                            <a><i className="fab fa-instagram"></i></a>
                          </Link>
                          <Link href="#0">
                            <a><i className="fab fa-youtube"></i></a>
                          </Link>
                      </div>
                      <div className="copy-right">
                          <p>
                              { appData.footerText }{' '}
                                <Link href="#0">
                                    <a>{ appData.themeAuthor }</a>
                                </Link>.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </footer>
  )
}

export default Footer