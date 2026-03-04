

## Plan: Remove duplicate campaign selector from NavActiveCampaign

**Problem**: `NavActiveCampaign.tsx` has a conditional block (lines 56-78) that renders a `<Select>` dropdown for admins with `adminCampanhas.length > 1`. Only n.neemias triggers this because he has 2+ campaigns linked. Other admins have 1 campaign, so they see the correct badge.

**Fix in `src/components/navigation/NavActiveCampaign.tsx`**:

1. Remove the `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue` imports (line 5)
2. Remove the `adminCampanhas` state and its fetch `useEffect` (lines 10, 16-33) — no longer needed
3. Remove the entire conditional block (lines 56-78) that renders the `<Select>` dropdown
4. Keep the campaign name fetch and the read-only badge display (lines 35-54, 80-96)

After this, all admins (including n.neemias) will see the same clean badge. Campaign switching stays exclusively in `NavUserMenu`.

