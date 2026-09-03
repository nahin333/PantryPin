"use client";

import { ChangeEvent, DragEvent, FormEvent, useEffect, useRef, useState } from "react";
import { getDemoAnalysis } from "@/lib/demo-data";
import { priceIngredients, recipeGuides } from "@/lib/pricing";
import type { AnalysisResult } from "@/lib/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const externalApi = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
const staticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "true";

type IconName = "camera" | "pin" | "spark" | "upload" | "arrow" | "check" | "flame" | "bag" | "book" | "refresh" | "shield";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    camera: <><path d="M14.5 4 16 6h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1.5-2z"/><circle cx="12" cy="13" r="4"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    spark: <><path d="m12 3-1.2 4.3a5 5 0 0 1-3.5 3.5L3 12l4.3 1.2a5 5 0 0 1 3.5 3.5L12 21l1.2-4.3a5 5 0 0 1 3.5-3.5L21 12l-4.3-1.2a5 5 0 0 1-3.5-3.5Z"/></>,
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 15v4h14v-4"/></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    flame: <path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4.5-8.5 0 3-1.5 4.5-2.5 5.5 0-4-2-7-5-10 0 5-2 7-2 11 0 5 3 9 7 9Z"/>,
    bag: <><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    book: <><path d="M4 5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2Z"/><path d="M20 5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2Z"/></>,
    refresh: <><path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 0-2 5"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Header({ onReset }: { onReset: () => void }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={onReset} aria-label="PantryPin home">
        <span className="brand-mark"><Icon name="pin" size={18} /></span>
        <span>Pantry<span>Pin</span></span>
      </button>
      <nav aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#about">About</a>
      </nav>
      <a className="header-cta" href="#analyzer">Analyze a photo <Icon name="arrow" size={17} /></a>
    </header>
  );
}

function UploadPanel({ onResult }: { onResult: (result: AnalysisResult, preview: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [zip, setZip] = useState("94107");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  function chooseFile(nextFile?: File) {
    if (!nextFile) return;
    setError("");
    if (!nextFile.type.startsWith("image/")) return setError("Please choose a JPG, PNG, or WebP image.");
    if (nextFile.size > 5_500_000) return setError("That image is over 5 MB. Choose a smaller photo.");
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(nextFile);
    setPreview(URL.createObjectURL(nextFile));
  }

  async function trySample() {
    const response = await fetch(`${basePath}/sample-bowl.svg`);
    const blob = await response.blob();
    chooseFile(new File([blob], "mediterranean-bowl.svg", { type: "image/svg+xml" }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) return setError("Add a food photo to continue.");
    if (!/^\d{5}$/.test(zip)) return setError("Enter a valid 5-digit ZIP code.");
    setLoading(true);
    setError("");
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Could not read that image."));
        reader.readAsDataURL(file);
      });
      let data: AnalysisResult;
      if (staticDemo && !externalApi) {
        await new Promise((resolve) => window.setTimeout(resolve, 700));
        const analysis = getDemoAnalysis(file.name);
        const pricing = priceIngredients(analysis.ingredients, zip);
        data = {
          ...analysis,
          ...pricing,
          recipes: recipeGuides(analysis.dish),
          pricingMode: "estimated",
          analysisMode: "demo",
          zip
        };
      } else {
        const response = await fetch(`${externalApi}/api/analyze`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl, filename: file.name, zip })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Analysis failed.");
        data = payload;
      }
      onResult(data, dataUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="upload-card" id="analyzer" onSubmit={submit}>
      <div className="upload-heading">
        <span className="eyebrow"><Icon name="spark" size={15} /> Food intelligence, made simple</span>
        <h2>What’s on your plate?</h2>
        <p>Upload a clear photo to explore ingredients, nutrition, and a grocery-planning view.</p>
      </div>
      {staticDemo && !externalApi && <p className="demo-banner"><strong>GitHub Pages demo:</strong> try the example or a file named “cake” or “pizza.” Secure vision analysis is not connected yet.</p>}
      <div
        className={`drop-zone ${dragging ? "is-dragging" : ""} ${preview ? "has-preview" : ""}`}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event: DragEvent) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0]); }}
      >
        {preview ? (
          <><img src={preview} alt="Selected food preview" /><button type="button" className="replace-photo" onClick={() => inputRef.current?.click()}><Icon name="refresh" size={15} /> Replace</button></>
        ) : (
          <button className="drop-button" type="button" onClick={() => inputRef.current?.click()}>
            <span className="upload-icon"><Icon name="upload" size={27} /></span>
            <strong>Drop your food photo here</strong>
            <small>or click to browse · JPG, PNG or WebP · 5 MB max</small>
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={(event: ChangeEvent<HTMLInputElement>) => chooseFile(event.target.files?.[0])} hidden />
      </div>
      <div className="form-row">
        <label>
          <span>Your ZIP code</span>
          <span className="input-shell"><Icon name="pin" size={18} /><input inputMode="numeric" maxLength={5} value={zip} onChange={(event) => setZip(event.target.value.replace(/\D/g, ""))} aria-label="ZIP code" /></span>
        </label>
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? <><span className="spinner" /> Analyzing your plate…</> : <>Analyze my food <Icon name="arrow" size={18} /></>}
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!file && <button className="sample-link" type="button" onClick={trySample}>No photo handy? Try our example bowl</button>}
      <p className="privacy"><Icon name="shield" size={14} /> {staticDemo && !externalApi ? "This demo keeps the photo in your browser." : "Sent to your configured analysis service; not persisted by PantryPin."}</p>
    </form>
  );
}

function StatRing({ value }: { value: number }) {
  return <div className="confidence" style={{ background: `conic-gradient(var(--lime) ${value}%, #e8e8e1 0)` }}><span>{value}%<small>confident</small></span></div>;
}

function Results({ result, preview, onReset }: { result: AnalysisResult; preview: string; onReset: () => void }) {
  const [tab, setTab] = useState<"ingredients" | "stores" | "recipes">("ingredients");
  const [showAll, setShowAll] = useState(false);
  const visibleIngredients = showAll ? result.ingredients : result.ingredients.slice(0, 6);
  const recipeEmoji = ["🥣", "🍋", "👩‍🍳"];

  return (
    <main className="results-page">
      <section className="result-hero">
        <div className="result-photo"><img src={preview} alt={result.dish} /><span><Icon name="spark" size={14} /> Analysis complete</span></div>
        <div className="result-intro">
          <div className="result-kicker"><span>{result.cuisine}</span><span>•</span><span>{result.servingDescription}</span></div>
          <h1>{result.dish}</h1>
          <p>{result.description}</p>
          <div className="mode-note">{result.analysisMode === "demo" ? "Canned scenario—not pixel analysis" : "AI photo estimate"} · Simulated retailer data</div>
        </div>
        <StatRing value={result.confidence} />
      </section>

      <section className="summary-grid" aria-label="Analysis summary">
        <article className="summary-card calorie-card">
          <span className="summary-icon coral"><Icon name="flame" /></span>
          <div><small>Estimated calories</small><strong>{result.calories.best}<em> kcal</em></strong><p>Likely range {result.calories.low}–{result.calories.high}</p></div>
        </article>
        <article className="summary-card">
          <span className="summary-icon green"><Icon name="spark" /></span>
          <div><small>Macro estimate</small><div className="macro-row"><strong>{result.macros.protein}g<em>protein</em></strong><strong>{result.macros.carbs}g<em>carbs</em></strong><strong>{result.macros.fat}g<em>fat</em></strong></div></div>
        </article>
        <article className="summary-card">
          <span className="summary-icon yellow"><Icon name="bag" /></span>
          <div><small>Lowest demo basket</small><strong>${result.cheapestTotal.toFixed(2)}</strong><p>Simulated at {result.stores[0]?.store}</p></div>
        </article>
      </section>

      {result.warnings.length > 0 && <div className="estimate-banner"><Icon name="spark" size={17} /><span><strong>A useful estimate, not a lab test.</strong> {result.warnings[0]}</span></div>}

      <div className="tabs" role="tablist" aria-label="Analysis details">
        <button className={tab === "ingredients" ? "active" : ""} onClick={() => setTab("ingredients")}>Ingredients <span>{result.ingredients.length}</span></button>
        <button className={tab === "stores" ? "active" : ""} onClick={() => setTab("stores")}>Compare stores</button>
        <button className={tab === "recipes" ? "active" : ""} onClick={() => setTab("recipes")}>How to make it</button>
      </div>

      {tab === "ingredients" && <section className="detail-section">
        <div className="section-heading"><div><span className="eyebrow">Inside the dish</span><h2>Your ingredient breakdown</h2><p>Likely ingredients for recreating a full recipe. Package prices shown are illustrative.</p></div><div className="zip-pill"><Icon name="pin" size={15} /> Demo ZIP {result.zip}</div></div>
        <div className="ingredient-table">
          <div className="table-head"><span>Ingredient & estimate</span><span>Calories</span><span>Lowest demo price</span></div>
          {visibleIngredients.map((item, index) => (
            <div className="ingredient-row" key={item.name}>
              <div className="ingredient-name"><span className={`food-dot food-${index % 5}`}>{["Q", "C", "T", "Cu", "F"][index % 5]}</span><div><strong>{item.name}</strong><small>{item.amount} {item.unit} · {item.confidence} confidence{item.note ? ` · ${item.note}` : ""}</small></div></div>
              <span className="ingredient-calories">{Math.round(item.calories)} kcal</span>
              <div className="price-cell"><strong>${item.bestPrice.toFixed(2)}</strong><small>{item.package} at {item.store}</small></div>
            </div>
          ))}
        </div>
        {result.ingredients.length > 6 && <button className="outline-button" onClick={() => setShowAll(!showAll)}>{showAll ? "Show fewer" : `Show all ${result.ingredients.length} ingredients`}</button>}
      </section>}

      {tab === "stores" && <section className="detail-section">
        <div className="section-heading"><div><span className="eyebrow">Basket scenario</span><h2>Compare simulated baskets</h2><p>Illustrative package figures seeded by ZIP {result.zip}; no retailer API or inventory lookup.</p></div></div>
        <div className="store-grid">
          {result.stores.map((store, index) => <article className={`store-card ${index === 0 ? "winner" : ""}`} key={store.store}>
            {index === 0 && <span className="best-tag"><Icon name="check" size={14} /> Best total</span>}
            <div className="store-logo" style={{ background: store.color }}>{store.store.slice(0, 1)}</div>
            <h3>{store.store}</h3><p>Example location · {store.distance} miles</p>
            <strong>${store.total.toFixed(2)}</strong><small>{store.itemCount} items · {store.pickup}</small>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(store.store + " groceries near " + result.zip)}`} target="_blank" rel="noreferrer">Find real stores <Icon name="arrow" size={16} /></a>
          </article>)}
        </div>
        <p className="pricing-disclaimer">All store names, prices, distances, availability, and pickup times above are simulated. PantryPin is not affiliated with these retailers. Search and confirm current details directly with the retailer.</p>
      </section>}

      {tab === "recipes" && <section className="detail-section">
        <div className="section-heading"><div><span className="eyebrow">From cart to kitchen</span><h2>Make it at home</h2><p>Generated searches for this dish on established cooking sites—not selected or verified recipes.</p></div></div>
        <div className="recipe-grid">
          {result.recipes.map((recipe, index) => <a className="recipe-card" href={recipe.url} target="_blank" rel="noreferrer" key={recipe.publisher}>
            <span className="recipe-art">{recipeEmoji[index]}</span><div><small>{recipe.publisher}</small><h3>{recipe.title}</h3><p>External site search</p><strong>View search results <Icon name="arrow" size={16} /></strong></div>
          </a>)}
        </div>
      </section>}

      <button className="analyze-another" onClick={onReset}><Icon name="camera" size={18} /> Analyze another photo</button>
    </main>
  );
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [preview, setPreview] = useState("");
  function reset() { setResult(null); setPreview(""); window.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <div>
      <Header onReset={reset} />
      {result ? <Results result={result} preview={preview} onReset={reset} /> : <>
        <main className="landing">
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow"><Icon name="spark" size={15} /> One photo. The whole story.</span>
              <h1>See what’s in it.<br/><em>Explore what it might cost.</em></h1>
              <p>Explore the path from a food photo to likely ingredients, nutrition estimates, and a grocery-planning view—then find resources to make it yourself.</p>
              <div className="hero-points"><span><Icon name="check" size={15}/> Ingredient breakdown</span><span><Icon name="check" size={15}/> Nutrition estimate</span><span><Icon name="check" size={15}/> Grocery planning view</span></div>
            </div>
            <UploadPanel onResult={(data, nextPreview) => { setResult(data); setPreview(nextPreview); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </section>
          <section className="how" id="how-it-works">
            <span className="eyebrow centered">A smarter way to shop & cook</span><h2>From photo to pantry in three steps</h2>
            <div className="step-grid">
              <article><span>01</span><i><Icon name="camera" size={25}/></i><h3>Snap your food</h3><p>Upload any meal, snack, fruit, dessert, or drink. Clear, well-lit photos work best.</p></article>
              <article><span>02</span><i><Icon name="spark" size={25}/></i><h3>We unpack it</h3><p>With the API configured, vision analysis estimates the dish, serving nutrition, and likely ingredients.</p></article>
              <article><span>03</span><i><Icon name="bag" size={25}/></i><h3>Plan & make it</h3><p>Explore an illustrative basket and jump to cooking-site searches for recreating the food.</p></article>
            </div>
          </section>
          <section className="trust-section" id="about">
            <div><span className="eyebrow">Built for useful decisions</span><h2>Clarity over false precision.</h2></div>
            <p>A photo can’t reveal exact quantities or hidden ingredients. PantryPin shows ranges, confidence, and clear source labels so you always know what is inferred and what is verified.</p>
          </section>
        </main>
      </>}
      <footer><div className="brand"><span className="brand-mark"><Icon name="pin" size={17}/></span><span>Pantry<span>Pin</span></span></div><p>Food insight for curious eaters.</p><small>Nutrition is estimated; retailer data is simulated. Not medical advice.</small></footer>
    </div>
  );
}
