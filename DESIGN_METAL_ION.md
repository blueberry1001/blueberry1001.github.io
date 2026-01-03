# Metal Ion Systematic Analysis App - Design Document

## 1. Overview
This application simulates the systematic qualitative analysis of metal ions for high school chemistry (university entrance exam level). 
The goal is to allow users to experience the logic behind the separation procedures and understand the consequences of incorrect operations (e.g., getting a mixture of precipitates that cannot be separated).

## 2. Target Ions (19 Types)
- **Group 1**: Ag⁺, Pb²⁺, Hg₂²⁺
- **Group 2**: Pb²⁺, Hg²⁺, Cu²⁺, Cd²⁺, Sn²⁺ (Precipitate with H₂S in acid)
- **Group 3**: Al³⁺, Fe³⁺, (Cr³⁺ excluded) (Precipitate with NH₃/NH₄Cl)
- **Group 4**: Zn²⁺, Ni²⁺, Co²⁺, Mn²⁺ (Precipitate with H₂S in base)
- **Group 5**: Ca²⁺, Ba²⁺, Sr²⁺ (Precipitate with (NH₄)₂CO₃)
- **Group 6**: Mg²⁺, Na⁺, K⁺ (No precipitate generally)

*Note: Pb²⁺ belongs to Group 1 but has significant solubility in hot water, so remnants appear in Group 2.*

## 3. Logic & State Management

### 3.1 Ion State
Each ion tracks its current form:
- **Solution (SOL)**: Free ion available for reaction.
- **Precipitate (PPT)**: Solid, removed from liquid phase interactions (unless dissolved).
- **Complex (CPLX)**: Soluble complex ion (e.g., [Zn(NH₃)₄]²⁺).
- **Lost/Diffused**: If a gas forms or specific error state.

### 3.2 Global State
- **pH**: acidic | neutral | basic
- **Temperature**: room_temp | hot
- **Added Reagents History**: List of operations performed.
- **Current Ions**: List of Ion objects.

### 3.3 Operations and Consequences

The engine is rule-based. When an operation occurs:
1.  Check current environment (pH, etc.).
2.  Update environment based on reagent.
3.  Apply reaction rules to all **SOL** ions.
4.  Update status of affected ions.
5.  Check for "Game Over" / "Analysis Failed" conditions (e.g., mixed precipitate that is hard to separate in standard HS curriculum).

#### Key Operations:

1.  **Add Dilute HCl**
    *   **Effect**: pH -> Acidic.
    *   **Reaction**: Ag⁺, Pb²⁺, Hg₂²⁺ -> AgCl (White), PbCl2 (White), Hg2Cl2 (White).
    *   **Failure Mode**: If added *after* H₂SO₄, PbSO₄ might already be there. (But usually acts as start).

2.  **Add H₂S**
    *   **Effect**: Adds Sulfide ions.
    *   **Rules**:
        *   **If Acidic**: Ag, Pb, Hg₂, Hg, Cu, Cd, Sn precipitate as sulfides.
        *   **If Neutral/Basic**: All above PLUS Zn, Ni, Co, Mn, Fe(as FeS). Al precipitates as Al(OH)₃ due to hydrolysis.
    *   **Lesson**: Adding H₂S in basic conditions first causes massive co-precipitation (Groups 1, 2, 3, 4 mixed). -> **"Analysis Failed"**.

3.  **Boil (Remove H₂S) + Add HNO₃**
    *   **Effect**: Removes S²⁻. Oxidizes Fe²⁺ -> Fe³⁺ (if any).
    *   This is a preparatory step for Group 3.

4.  **Add NH₃ (Small Amount)**
    *   **Effect**: pH -> Basic.
    *   **Reaction**: Most metals precipitate as Hydroxides (Ag, Cu, Zn, etc. form unstable oxides/hydroxides).

5.  **Add NH₃ (Excess)**
    *   **Effect**: pH -> Basic.
    *   **Reaction**:
        *   Precipitates: Fe(OH)₃ (Red-brown), Al(OH)₃ (White).
        *   Complexes (Re-dissolve): Ag⁺, Cu²⁺, Zn²⁺, Ni²⁺, Co²⁺, Cd²⁺? (Cd forms approx).
        *   HS Level Focus: Cu (Deep Blue), Zn (Colorless), Ag (Colorless), Ni (Violet).
    *   **Separation**: Separates Al/Fe from Zn/Ni/Co/Mn *if* S²⁻ is absent.

6.  **Add (NH₄)₂CO₃**
    *   **Effect**: Adds Carbonate.
    *   **Reaction**: Ca²⁺, Ba²⁺, Sr²⁺ -> Carbonates (White).
    *   **Mg²⁺**: Does not precipitate (soluble enough) at typical concentrations, or separate step.

## 4. Data Structures (TypeScript)

```typescript
export type IonSymbol = 
  | 'Ag⁺' | 'Pb²⁺' | 'Hg₂²⁺' | 'Hg²⁺' | 'Cu²⁺' | 'Cd²⁺' | 'Sn²⁺'
  | 'Al³⁺' | 'Fe³⁺' | 'Zn²⁺' | 'Ni²⁺' | 'Co²⁺' | 'Mn²⁺'
  | 'Ca²⁺' | 'Ba²⁺' | 'Sr²⁺' | 'Mg²⁺' | 'Na⁺' | 'K⁺';

export type IonStatus = 'SOLUTION' | 'PRECIPITATE' | 'COMPLEX';

export interface IonData {
  symbol: IonSymbol;
  status: IonStatus;
  color: string; // Color of solution or precipitate
  formula: string; // Current formula (e.g., "Ag⁺", "AgCl")
}

export interface OperationResult {
  message: string;
  precipitated: IonSymbol[];
  redissolved: IonSymbol[];
  warning?: string; // "Analysis Impossible: Mixed Group 2 & 4"
}
```

## 5. UI Implementation Plan
1.  **Sidebar/Top Bar**: List of available reagents (HCl, H₂S, NH₃, NaOH, etc.).
2.  **Main View**: Beaker visual.
    *   Show liquid color (mix of ions).
    *   Show precipitate pile at bottom (colored layers or mixed).
3.  **Status Panel**:
    *   "Current Solution": List of ions.
    *   "Precipitates": List of formed solids.
4.  **Feedback**:
    *   When an operation is performed, animate the change.
    *   If a "Fatal Mistake" (Bad Order) occurs, show an alert explaining WHY.
