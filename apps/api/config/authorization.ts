import env from '#start/env'

const disclosureDomains = (env.get('AUTHZ_API_RESPONSE_DISCLOSURE_DOMAINS') || '')
  .split(',')
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean)

const authorizationConfig = {
  apiResponseObfuscationEnabled: env.get('AUTHZ_API_RESPONSE_OBFUSCATION_ENABLED') ?? true,
  apiResponseDisclosureDomains: disclosureDomains,
}

export default authorizationConfig
