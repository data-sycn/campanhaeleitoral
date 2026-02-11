import { useAuth } from "@/hooks/useAuth";

/**
 * Returns the active campanha_id for data filtering.
 * Master users can optionally override with a specific campanhaId.
 */
export function useCampanhaFilter(overrideCampanhaId?: string | null) {
  const { campanhaId, userRoles } = useAuth();
  const isMaster = userRoles.includes("master");

  // Master with override uses the override; otherwise use profile's campanha_id
  if (isMaster && overrideCampanhaId) return overrideCampanhaId;
  return campanhaId;
}
