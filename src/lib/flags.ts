export const getFlagUrl = (symbol: string) => {
  const code = symbol.toLowerCase();
  // Map common crypto/currency symbols to country codes for flags
  const map: Record<string, string> = {
    usd: 'us',
    eur: 'eu',
    gbp: 'gb',
    aed: 'ae',
    try: 'tr',
    cny: 'cn',
    jpy: 'jp',
    cad: 'ca',
    aud: 'au',
    omr: 'om',
    kwd: 'kw',
    // Crypto placeholders (using generic icons or specific fallbacks if needed)
    btc: 'btc', 
    usdt: 'usdt',
    eth: 'eth'
  };

  const countryCode = map[code];
  
  if (!countryCode) return null;
  
  // Crypto handling - usually we'd use a crypto icon set, but for this demo we might use a fallback
  if (['btc', 'usdt', 'eth'].includes(countryCode)) {
      return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/32/color/${countryCode}.png`;
  }

  return `https://flagcdn.com/w80/${countryCode}.png`;
};
