

## Plan: Replace Google Places with IBGE API for Municipality Autocomplete

### What changes

Replace the Google Places autocomplete in the Municípios form with a custom autocomplete powered by the IBGE API (`servicodados.ibge.gov.br/api/v1/localidades/municipios`).

### Implementation

1. **Remove Google Places logic** from `Municipios.tsx` — delete the entire `useEffect` that loads Google Maps script and initializes the Autocomplete instance (lines ~60-135).

2. **Add IBGE autocomplete** — fetch the full municipality list from IBGE once (on component mount or dialog open), then filter locally as the user types in the "Nome" field. Show a dropdown with matching cities (name + UF). On selection, auto-fill:
   - `nome` (city name)
   - `estado` (UF)
   - `populacao` (via IBGE population API, using the municipality's IBGE code)

3. **UI** — use a simple filtered list below the input (similar to a combobox), styled with existing Tailwind classes. No external dependency needed.

### Technical details

- IBGE municipalities endpoint: `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome` (~5,570 results, ~800KB, cached in state)
- Population endpoint: `https://servicodados.ibge.gov.br/api/v3/agregados/4714/periodos/-6/variaveis/93?localidades=N6[{ibgeId}]`
- Filter with normalized string matching (remove accents), limit visible suggestions to ~10
- Store IBGE code per municipality to avoid re-fetching the full list for population lookup

