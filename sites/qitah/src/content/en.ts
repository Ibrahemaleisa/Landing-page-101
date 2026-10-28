import type { Content } from "./types";
import { finderOptions } from "./vehicles";

const v = finderOptions("en");

export const en: Content = {
  meta: {
    title: "Qitah — car parts from trusted merchants, at a clear price",
    description:
      "Qitah is a Saudi marketplace for automotive spare parts: search by your vehicle or part number, compare offers from independent merchants on price, warranty and delivery time, and get it delivered to your home or workshop.",
    siteName: "Qitah",
  },
  ui: {
    skip: "Skip to content",
    nav: "Main",
    menu: "Menu",
    close: "Close menu",
    language: "Language",
    home: "Qitah home",
    footerNav: "Footer",
    logo: "Qitah",
    currency: "SAR",
    sample: "Sample data",
  },
  nav: {
    links: [
      { href: "#categories", label: "Categories" },
      { href: "#how", label: "How it works" },
      { href: "#results", label: "Compare offers" },
      { href: "#merchants", label: "Merchants" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { label: "Find a part", href: "#finder", icon: "search" },
  },
  hero: {
    eyebrow: "The car parts marketplace for Saudi Arabia",
    title: ["The right part for your car,", "at a clear price, from a seller you know"],
    lead: "Choose your vehicle, then compare offers from independent parts merchants in one place: price, condition, warranty and delivery time. Have it delivered to your home or straight to your workshop.",
    actions: [{ label: "How Qitah works", href: "#how", variant: "secondary" }],
    assurances: ["Prices include VAT", "Returns within 7 days of delivery", "Home or workshop delivery"],
  },
  finder: {
    title: "Find a part for your car",
    lead: "Choose your vehicle and we show compatible parts first.",
    make: { label: "Make", placeholder: "Select", options: v.makes },
    model: { label: "Model", placeholder: "Select", groups: v.groups },
    year: { label: "Year", placeholder: "Select", options: v.years },
    query: {
      label: "Part name or number",
      placeholder: "e.g. front brake pads",
      hint: "You can type the original (OEM) part number as it is, with or without dashes.",
    },
    submit: "Search parts",
    popularLabel: "Popular searches",
    popular: ["Brake pads", "Oil filter", "Battery", "Front shock absorbers", "Spark plugs"],
    fit: { label: "Fits your car", detail: "We show how each part fits your car before you order." },
  },
  categories: {
    eyebrow: "Categories",
    title: "Browse parts by category",
    lead: "From brakes to lighting, every part sits in its category with offers from more than one merchant.",
    items: [
      { id: "brakes", name: "Brakes", hint: "Pads, discs, sensors" },
      { id: "filters", name: "Filters", hint: "Oil, air, cabin, fuel" },
      { id: "oils", name: "Oils & fluids", hint: "Engine oil, coolant" },
      { id: "engine", name: "Engine", hint: "Plugs, belts, sensors" },
      { id: "suspension", name: "Suspension", hint: "Shocks, arms, bushings" },
      { id: "electrical", name: "Electrical", hint: "Batteries, alternators, starters" },
      { id: "lighting", name: "Lighting", hint: "Head and tail lamps" },
      { id: "cooling", name: "Cooling", hint: "Radiators, fans, thermostats" },
      { id: "body", name: "Body", hint: "Mirrors, bumpers, doors" },
    ],
  },
  steps: {
    eyebrow: "How Qitah works",
    title: "Three steps from search to fitting",
    lead: "No more driving between shops or calling around: every offer is in front of you, and the choice is yours.",
    items: [
      { title: "Search by your car", body: "Choose make, model and year, or type the original part number. Compatible results come first." },
      { title: "Compare offers", body: "The same part from several merchants: compare price, condition, warranty, delivery time and seller rating." },
      { title: "Get it at home or the workshop", body: "Pay the way that suits you, choose where it goes, and follow your shipment step by step." },
    ],
  },
  story: {
    eyebrow: "A clearer decision",
    title: "Everything you need to choose with confidence",
    lead: "We don't own inventory or set prices: independent merchants list their offers, and you compare and choose.",
    items: [
      {
        eyebrow: "Offer comparison",
        title: "Merchant offers side by side",
        body: "Offers are sorted by estimated total, the part price plus the cheapest available delivery, with the cheapest, fastest and top-rated marked, so you know what you'll pay before you order.",
        points: ["Genuine or aftermarket, new or used: always labelled", "Seller service rating kept separate from the part rating", "Prices include VAT"],
      },
      {
        eyebrow: "Fitment",
        title: "Know whether it fits before you order",
        body: "We show where fitment data comes from: a catalog match, or a seller's claim that needs confirming with your VIN. The status is always written out, never colour alone.",
        points: ["Save more than one car in your garage", "Search by part number and OEM cross-references", "Confirm fitment with the seller using your VIN"],
      },
      {
        eyebrow: "Delivery",
        title: "To your home, or straight to your workshop",
        body: "Choose a destination for each order and follow every shipment from seller confirmation to hand-over. Order from several merchants and each shipment arrives on its own.",
        points: ["Track every shipment by stage", "Cancel before hand-over to the carrier", "Returns within 7 days of delivery"],
      },
    ],
  },
  offers: {
    label: "Illustration: comparing offers for one part",
    part: "Front brake pads",
    partNumberLabel: "Part no.",
    partNumber: "04465-X3301",
    vehicle: "Toyota Camry 2022",
    count: "3 offers",
    sortLabel: "Sorted by",
    sort: "Estimated total",
    badges: { cheapest: "Cheapest", fastest: "Fastest", topRated: "Top rated" },
    selected: "Selected offer",
    ratingLabel: "Seller rating",
    reviews: "ratings",
    deliveryLabel: "Delivery",
    items: [
      { seller: "Eastern Parts Co.", city: "Dammam", condition: "Aftermarket · New", price: 245, delivery: "In 2–3 days", rating: 4.5, reviews: 860, badges: ["cheapest"] },
      { seller: "Riyadh Parts Center", city: "Riyadh", condition: "Genuine · New", price: 289, delivery: "Tomorrow", rating: 4.8, reviews: 1240, badges: ["topRated"], selected: true },
      { seller: "Brake House", city: "Riyadh", condition: "Genuine · New", price: 310, delivery: "Today", rating: 4.6, reviews: 410, badges: ["fastest"] },
    ],
    vat: "Prices include VAT",
  },
  fit: {
    label: "Illustration: fitment states",
    vehicle: "Your car: Toyota Camry 2022",
    items: [
      { state: "fits", part: "Front brake pads", partNumber: "04465-X3301", status: "Fits your car", detail: "Matched by catalog data. Confirm with your VIN before fitting." },
      { state: "confirm", part: "Front brake disc", partNumber: "TRV-R4410", status: "Needs confirmation", detail: "The seller says it fits; we haven't verified it. Message them your VIN." },
    ],
  },
  tracking: {
    label: "Illustration: tracking a shipment",
    order: "Shipment from Riyadh Parts Center",
    destinationLabel: "Delivering to",
    destination: "Workshop · Riyadh",
    stages: [
      { title: "Order placed", time: "Sun 9:12 AM", state: "done" },
      { title: "Seller confirmed", time: "Sun 9:40 AM", state: "done" },
      { title: "Handed to carrier", time: "Sun 4:05 PM", state: "done" },
      { title: "Out for delivery", time: "Mon 10:20 AM", state: "now" },
      { title: "Delivered", time: "Expected today", state: "todo" },
    ],
    stateLabels: { done: "Completed", now: "Current stage", todo: "Upcoming" },
  },
  trust: {
    eyebrow: "Why Qitah",
    title: "An open marketplace with clear rules",
    lead: "Qitah brings independent parts merchants together. Each merchant owns its stock and sets its prices; we organise the listings, payment and delivery.",
    items: [
      { icon: "badge-check", title: "Verified merchants", body: "Every seller shows its business verification status, on-time delivery rate and response time." },
      { icon: "star", title: "Two ratings, never mixed", body: "The part's rating is separate from the seller's service rating, so you know where the quality lies." },
      { icon: "shield", title: "7-day returns", body: "If a part arrives wrong or damaged, request a return from the order page within 7 days of delivery." },
      { icon: "package", title: "Genuine or aftermarket, clearly", body: "Genuine, aftermarket, used and refurbished parts are always labelled, so they never blur." },
      { icon: "wrench", title: "Built for workshops too", body: "Order in your name and have the part delivered straight to the workshop that will fit it." },
      { icon: "lock", title: "Familiar ways to pay", body: "The app supports mada, Apple Pay, STC Pay and cards, plus instalments with Tabby and Tamara." },
    ],
  },
  stats: {
    eyebrow: "By the numbers",
    title: "A look at the demo build",
    lead: "Figures from the demo data in the Qitah app, not real performance or sales metrics.",
    items: [
      { value: "9", label: "Main part categories" },
      { value: "8", label: "Makes in the sample vehicle catalog" },
      { value: "6", label: "Cities in the sample merchant data" },
      { value: "7", label: "Days to request a return after delivery" },
    ],
    note: "Sample data: every product, merchant, price and rating on this page and in the current app build is for demonstration only.",
  },
  merchant: {
    eyebrow: "For merchants",
    title: ["Sell on Qitah", "and be there when drivers search for your part"],
    lead: "List your stock at your prices and receive orders from customers who have already chosen their vehicle. We organise payment and delivery; your inventory and pricing stay yours.",
    actions: [
      { label: "Register your store", href: "https://merchants.qitah.example/register", icon: "arrow-right" },
      { label: "See the merchant portal", href: "https://merchants.qitah.example/", variant: "secondary" },
    ],
    points: ["Arabic-first merchant portal", "Commission on fulfilled orders only", "Home and workshop delivery"],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions customers ask us",
    lead: "Can't find your answer? Our support team can help from inside the app.",
    items: [
      {
        question: "How do I know a part fits my car?",
        answer:
          "Add your car (make, model and year, plus your VIN if you like) and every part shows where its fitment data comes from: a catalog match, or a seller's claim that needs confirming. We always recommend confirming the part number with the seller using your VIN before fitting.",
      },
      {
        question: "Does Qitah sell parts itself?",
        answer: "No. Qitah is a marketplace for independent parts merchants. Each merchant owns its stock and sets its prices; we organise the listings, payment and delivery.",
      },
      {
        question: "Do prices include VAT?",
        answer: "Yes. Every price shown includes VAT, and the VAT amount appears in your order summary. Delivery fees are shown separately before you confirm.",
      },
      {
        question: "Which payment methods are available?",
        answer: [
          "The app supports mada, Apple Pay, STC Pay and bank cards, plus instalments with Tabby and Tamara subject to eligibility.",
          "In the current demo build, payments are simulated only and no money is charged.",
        ],
      },
      {
        question: "Can parts be delivered to a workshop?",
        answer: "Yes. Choose delivery to your home or straight to a service workshop. Some merchants don't deliver to workshops, and we show that on the offer before you order.",
      },
      {
        question: "What if the part I receive is wrong?",
        answer: "Request a return from the order page within 7 days of delivery and tell us why: wrong part, arrived damaged, or not as described.",
      },
    ],
  },
  footer: {
    tagline: "Qitah is a Saudi marketplace for car parts: the right part, at a clear price, from a seller you know.",
    groups: [
      {
        title: "Qitah",
        links: [
          { label: "How it works", href: "#how" },
          { label: "Categories", href: "#categories" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        title: "Merchants",
        links: [
          { label: "Sell on Qitah", href: "#merchants" },
          { label: "Merchant portal", href: "https://merchants.qitah.example/" },
        ],
      },
      {
        title: "Help",
        links: [
          { label: "Returns policy", href: "#faq" },
          { label: "Contact us", href: "#faq" },
        ],
      },
    ],
    legal: "© 2026 Qitah. Reference site: products, merchants and prices shown are sample data.",
  },
};
