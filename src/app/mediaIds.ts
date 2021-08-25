export interface LBRYMediaIds
{
  username: string;
  mediaHash: string;
}

export interface LBRYMediaClaims
{
  usernameClaim: string;
  mediaHashClaim: string;
}

export interface LBRYMediaUrlParts
{
  ids: LBRYMediaIds,
  claims: LBRYMediaClaims,
}
