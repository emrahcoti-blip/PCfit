export const metadata = { title: "Privacy Policy — PCFit" };

export default function Privacy() {
  return (
    <main className="container page">
      <h1>Privacy Policy</h1>
      <p>Last updated: June 2026</p>
      <h2>What we collect</h2>
      <p>
        PCFit does not require an account and does not collect names, email addresses, or payment
        details. The answers you submit in the build advisor form (budget, games, preferences)
        are sent to our server and to Anthropic's API solely to generate your recommendation.
        They are not used to build a profile of you and are not sold to anyone.
      </p>
      <h2>Third parties</h2>
      <ul>
        <li><strong>Anthropic (Claude API):</strong> processes your form answers to generate the build recommendation.</li>
        <li><strong>Vercel:</strong> hosts this website and may collect standard server logs (IP address, browser type) for security and performance.</li>
        <li><strong>Retailers (Amazon, Newegg):</strong> if you click a product link, the retailer may set cookies to attribute your visit, as described in their own privacy policies.</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        PCFit itself does not set tracking cookies. Affiliate retailers may set cookies on their
        own domains after you click through to them.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy questions: <a href="mailto:hello@pcfit.io">hello@pcfit.io</a>
      </p>
    </main>
  );
}
