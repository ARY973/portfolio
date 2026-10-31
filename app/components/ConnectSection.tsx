const links = [
  {
    label: "Email",
    value: "aryan.mudhole11@gmail.com",
    href: "mailto:aryan.mudhole11@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "aryan-ryan-mudhole",
    href: "https://www.linkedin.com/in/aryan-ryan-mudhole",
  },
  {
    label: "GitHub",
    value: "ARY973",
    href: "https://github.com/ARY973",
  },
  {
    label: "Résumé",
    value: "PDF, one page",
    href: "/resume/Aryan_Mudhole_Resume.pdf",
  },
];

export default function ConnectSection() {
  return (
    <section id="contact" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-16">
      <h2 className="text-3xl md:text-4xl mb-3">Get in touch</h2>
      <p
        className="prose-serif text-lg max-w-[52ch] mb-14"
        style={{ color: "var(--ink-2)" }}
      >
        I am on an F-1 visa and eligible for STEM OPT, which covers up to three
        years of work authorisation without sponsorship.
      </p>

      <dl className="rule-top" style={{ borderColor: "var(--rule-firm)" }}>
        {links.map((l) => (
          <div
            key={l.label}
            className="spine py-5 rule-bottom"
            style={{ borderColor: "var(--rule)" }}
          >
            <dt className="spine-label">{l.label}</dt>
            <dd>
              <a
                href={l.href}
                className="link"
                {...(l.href.startsWith("http") || l.href.endsWith(".pdf")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {l.value}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
