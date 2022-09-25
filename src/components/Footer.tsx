import "../styles/footer.scss";
import Logo from "./Logo";

export default function Footer() {
  const links = [
    { title: "About", link: "https://about.linkedin.com/" },
    { title: "Accessibility", link: "https://www.linkedin.com/accessibility" },
    { title: "Safety Center", link: "https://safety.linkedin.com/" },
    {
      title: "Community Guidelines",
      link: "https://www.linkedin.com/legal/professional-community-policies",
    },
    { title: "Careers", link: "https://careers.linkedin.com/" },
  ];

  return (
    <>
      <footer className="footer w-full">
        <div className="">
          <div className="row">
            <img src="../src\assets\Logo.png" width="130" height="30"></img>
            {links.map((item) => (
              <div className="footer-column" key={item.title}>
                <a
                  className="link"
                  onClick={() => window.open(item.link)}
                  key={item.link}
                >
                  {item.title}
                </a>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
