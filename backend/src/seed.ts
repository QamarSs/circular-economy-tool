import { randomUUID } from "crypto";
import db from "./db";

/**
 * Seed data for the Circular Economy Potential Model.
 * Structure mirrors the "Potentialfelder" (categories) and "Handlungsfelder"
 * (criteria) from the CEPM wheel: Product Development, Material Selection,
 * Usage, End-of-Life, Organisation.
 *
 * Safe to run multiple times — it only inserts when the criteria table is empty.
 */

type SeedCriterion = {
  name: string;
  description: string;
  bestPractice: string;
  recommendations: string[];
};

type SeedCategory = {
  id: string;
  name: string;
  criteria: SeedCriterion[];
};

const SEED: SeedCategory[] = [
  {
    id: "material_selection",
    name: "Material Selection",
    criteria: [
      {
        name: "Low-Impact Materials",
        description: "Extent to which materials with low environmental footprint (low CO2, low toxicity) are used.",
        bestPractice: "Patagonia — recycled polyester fleece; Adidas — Parley Ocean Plastic.",
        recommendations: [
          "Substitute virgin plastics with bio-based or recycled alternatives",
          "Run a material footprint comparison (LCA) at concept stage",
          "Set a minimum recycled-content target per component",
        ],
      },
      {
        name: "Use of Secondary Raw Materials",
        description: "Share of recycled or reclaimed materials used in the product.",
        bestPractice: "IKEA — recycled PET textiles; BMW — secondary aluminium in structural parts.",
        recommendations: [
          "Identify components where recycled-grade material meets spec",
          "Partner with certified recyclers for a stable secondary-material supply",
          "Label recycled content on the product/spec sheet",
        ],
      },
      {
        name: "Avoidance of Hazardous Substances",
        description: "Degree to which substances of concern (REACH/RoHS-relevant) are avoided by design.",
        bestPractice: "Apple — mercury/BFR/PVC-free electronics roadmap.",
        recommendations: [
          "Run a full REACH/RoHS substance screening on the BOM",
          "Replace flagged substances with pre-approved safer alternatives",
          "Document substance data in a material passport",
        ],
      },
      {
        name: "Sustainable & Transparent Supply Chain",
        description: "Traceability and sustainability performance of upstream suppliers.",
        bestPractice: "Patagonia — Footprint Chronicles supplier transparency map.",
        recommendations: [
          "Require supplier sustainability disclosures (e.g. EcoVadis score)",
          "Map tier-1 and tier-2 suppliers for material origin",
          "Prioritize regional suppliers to shorten and simplify the chain",
        ],
      },
      {
        name: "Preference for Regional Raw Materials",
        description: "Extent to which regionally sourced materials are prioritized to cut transport impact.",
        bestPractice: "Regional timber sourcing in European furniture manufacturing.",
        recommendations: [
          "Map current material origins and transport distances",
          "Qualify at least one regional supplier per critical material",
          "Factor transport emissions into supplier selection criteria",
        ],
      },
    ],
  },
  {
    id: "product_development",
    name: "Product Development",
    criteria: [
      {
        name: "Design for Manufacturability",
        description: "How well the design minimizes material waste and complexity during manufacturing.",
        bestPractice: "Standardized part families to reduce tooling and scrap rates.",
        recommendations: [
          "Simplify part count and standardize fasteners/interfaces",
          "Run a DFM review before design freeze",
          "Track manufacturing scrap rate as a design KPI",
        ],
      },
      {
        name: "Miniaturization",
        description: "Degree to which the product is designed to minimize material and volume.",
        bestPractice: "Consumer electronics generational size/weight reduction programs.",
        recommendations: [
          "Benchmark material mass per function against competitors",
          "Apply topology optimization to structural components",
          "Balance miniaturization against repairability and usability",
        ],
      },
      {
        name: "Human-Centered Design",
        description: "How strongly user needs and behavior shape circular design decisions.",
        bestPractice: "Fairphone — modular design informed by user repair studies.",
        recommendations: [
          "Conduct user research on repair, care, and disposal behavior",
          "Build personas and user journeys for the full product lifecycle",
          "Prototype and test circularity features with real users",
        ],
      },
      {
        name: "Reduction in Battery Use",
        description: "Extent to which battery size, count, or dependency is minimized or optimized.",
        bestPractice: "Hilti — fleet management to reduce redundant battery units.",
        recommendations: [
          "Evaluate energy-harvesting or mains-powered alternatives",
          "Right-size battery capacity to actual use profile",
          "Design batteries to be swappable and independently replaceable",
        ],
      },
      {
        name: "Weight Reduction / Lightweight Construction",
        description: "Use of lightweight construction principles to cut material and energy use.",
        bestPractice: "Automotive multi-material lightweight body structures.",
        recommendations: [
          "Apply topology and load-path optimization",
          "Substitute high-density materials with lightweight equivalents where safe",
          "Set a weight-reduction target per product generation",
        ],
      },
      {
        name: "Market Feasibility of Sustainable Products",
        description: "How well circular/sustainable solutions align with customer demand and willingness to pay.",
        bestPractice: "Signify — Light-as-a-Service; Michelin — Pay-per-Mile.",
        recommendations: [
          "Test circular value propositions with target customers early",
          "Benchmark pricing models against Product-as-a-Service peers",
          "Quantify total-cost-of-ownership benefits for the customer",
        ],
      },
      {
        name: "Extension of Technical Product Lifespan",
        description: "Degree to which the product is engineered for durability and long service life.",
        bestPractice: "Miele — components engineered and tested for 20-year lifespans.",
        recommendations: [
          "Set and test against a target service-life specification",
          "Design wear parts to be independently replaceable",
          "Use accelerated life testing to validate durability claims",
        ],
      },
      {
        name: "Emission Reduction (e.g. Noise, CO2)",
        description: "Reduction of emissions — CO2, noise, and other pollutants — across the lifecycle.",
        bestPractice: "Electrification and acoustic-dampening programs in power-tool design.",
        recommendations: [
          "Quantify baseline CO2e per unit across the lifecycle",
          "Set emission-reduction targets per product generation",
          "Identify the highest-emission lifecycle stage and prioritize it",
        ],
      },
      {
        name: "Energy and Resource Efficiency",
        description: "Efficiency of energy and resource use during production and operation.",
        bestPractice: "EU Ecodesign-compliant energy-efficient appliance classes.",
        recommendations: [
          "Benchmark energy consumption against best-in-class references",
          "Optimize production processes for energy intensity",
          "Communicate efficiency ratings transparently to customers",
        ],
      },
      {
        name: "Waste Reduction",
        description: "Extent to which production and packaging waste is minimized by design.",
        bestPractice: "Zero-waste-to-landfill manufacturing programs.",
        recommendations: [
          "Audit production waste streams and set reduction targets",
          "Redesign packaging to eliminate non-recyclable materials",
          "Reuse production offcuts as input material where feasible",
        ],
      },
    ],
  },
  {
    id: "usage",
    name: "Usage",
    criteria: [
      {
        name: "Prolonged Product Usage Duration",
        description: "Features and services that encourage customers to use the product longer.",
        bestPractice: "Patagonia Worn Wear — repair and resale extending garment life.",
        recommendations: [
          "Offer maintenance plans or repair services",
          "Provide care instructions that extend usable life",
          "Introduce a trade-in or refurbishment program",
        ],
      },
      {
        name: "Product-Service Systems (PSS)",
        description: "Availability of service-based models (leasing, pay-per-use) instead of pure ownership.",
        bestPractice: "Signify — Light-as-a-Service; Michelin — Pay-per-Mile.",
        recommendations: [
          "Pilot a leasing or subscription model for a product line",
          "Design the product for take-back and refurbishment cycles",
          "Build a business case comparing sale vs. service revenue",
        ],
      },
      {
        name: "Information for Sustainable Use and Disposal",
        description: "Clarity of guidance given to users on sustainable use, care, and end-of-life disposal.",
        bestPractice: "Take-back labeling and QR-linked disposal instructions.",
        recommendations: [
          "Add clear disposal/recycling instructions to packaging or product",
          "Provide a digital product passport accessible via QR code",
          "Train customer-facing staff on sustainable-use guidance",
        ],
      },
      {
        name: "Transparent Product Data",
        description: "Availability of lifecycle and material data to users and downstream actors.",
        bestPractice: "Digital Product Passport pilots under the EU Ecodesign framework.",
        recommendations: [
          "Publish a material and lifecycle data sheet per product",
          "Adopt a standardized digital product passport format",
          "Make repair and spare-parts data publicly accessible",
        ],
      },
      {
        name: "Environmental Risk Identification",
        description: "Extent to which environmental risks during use are identified and mitigated.",
        bestPractice: "Risk registers used in automotive and industrial equipment design.",
        recommendations: [
          "Conduct an environmental risk assessment for the use phase",
          "Define mitigation measures for identified high-risk scenarios",
          "Review and update the risk register each product generation",
        ],
      },
    ],
  },
  {
    id: "end_of_life",
    name: "End-of-Life",
    criteria: [
      {
        name: "Recyclability",
        description: "How easily the product's materials can be recovered and recycled at end of life.",
        bestPractice: "Mono-material packaging designs with high recyclate purity.",
        recommendations: [
          "Use mono-materials wherever functionally possible",
          "Reduce the use of adhesives and mixed-material bonding",
          "Improve material identification labeling for sorting",
        ],
      },
      {
        name: "Ease of Disassembly",
        description: "How easily the product can be taken apart for repair, reuse, or recycling.",
        bestPractice: "Fairphone — modular, tool-light disassembly design.",
        recommendations: [
          "Replace adhesives and welds with reversible fasteners",
          "Design a documented disassembly sequence",
          "Minimize the number of distinct tools required for disassembly",
        ],
      },
      {
        name: "By-Products instead of Waste",
        description: "Extent to which production and end-of-life residues are converted into usable by-products.",
        bestPractice: "Industrial symbiosis — one process's waste becomes another's input.",
        recommendations: [
          "Map current waste streams for by-product potential",
          "Establish partnerships to route residues to other processes",
          "Redesign processes to generate reusable by-products by default",
        ],
      },
      {
        name: "Material and Product Reuse",
        description: "Degree to which components or the whole product can be reused after first use.",
        bestPractice: "Hilti — tool refurbishment and reuse within fleet management.",
        recommendations: [
          "Identify components suitable for direct reuse without reprocessing",
          "Set up a take-back and refurbishment channel",
          "Design connections to allow non-destructive part removal",
        ],
      },
    ],
  },
  {
    id: "organisation",
    name: "Organisation",
    criteria: [
      {
        name: "Corporate Culture Aligned with Sustainable Goals",
        description: "Degree to which sustainability values are embedded in company culture and decision-making.",
        bestPractice: "Sustainability KPIs embedded in leadership performance reviews.",
        recommendations: [
          "Define and communicate a clear circularity vision",
          "Embed sustainability KPIs in team and leadership goals",
          "Recognize and reward circular-design initiatives internally",
        ],
      },
      {
        name: "Employee Training and Skill Development",
        description: "Extent to which employees are trained in circular economy principles and methods.",
        bestPractice: "Internal ecodesign training and certification programs.",
        recommendations: [
          "Run circular-design training workshops for product teams",
          "Provide access to ecodesign checklists and tools",
          "Build internal case studies from completed projects",
        ],
      },
      {
        name: "Transparent Data Practices for Material Composition",
        description: "How systematically material composition data is captured, stored, and shared internally.",
        bestPractice: "Centralized material databases linked to BOM systems.",
        recommendations: [
          "Centralize material composition data in a shared system",
          "Link material data directly to the bill of materials (BOM)",
          "Standardize data formats across product lines",
        ],
      },
    ],
  },
];

function seed() {
  const existing = db.prepare("SELECT COUNT(*) as c FROM criteria").get() as { c: number };
  if (existing.c > 0) {
    console.log("Database already seeded — skipping.");
    return;
  }

  const insertCategory = db.prepare("INSERT INTO categories (id, name, sort_order) VALUES (?, ?, ?)");
  const insertCriterion = db.prepare(
    "INSERT INTO criteria (id, category_id, name, description, best_practice, sort_order) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const insertRecommendation = db.prepare(
    "INSERT INTO recommendations (id, criterion_id, action_text, sort_order) VALUES (?, ?, ?, ?)"
  );

  const tx = db.transaction(() => {
    SEED.forEach((category, catIndex) => {
      insertCategory.run(category.id, category.name, catIndex);
      category.criteria.forEach((criterion, critIndex) => {
        const criterionId = randomUUID();
        insertCriterion.run(
          criterionId,
          category.id,
          criterion.name,
          criterion.description,
          criterion.bestPractice,
          critIndex
        );
        criterion.recommendations.forEach((action, actionIndex) => {
          insertRecommendation.run(randomUUID(), criterionId, action, actionIndex);
        });
      });
    });
  });

  tx();
  console.log("Seed complete:", SEED.reduce((n, c) => n + c.criteria.length, 0), "criteria inserted.");
}

seed();
