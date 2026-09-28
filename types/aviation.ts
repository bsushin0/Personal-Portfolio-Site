export interface MetarData {
  icaoId: string
  reportTime: string
  temp: number | null
  dewp: number | null
  wdir: number | string | null
  wspd: number | null
  wgst: number | null
  visib: string | null
  altim: number | null
  wxString: string | null
  skyCondition: SkyCondition[]
  rawOb: string
  name?: string
  lat?: number
  lon?: number
  elev?: number
  fltcat?: string
}

export interface SkyCondition {
  cover: string
  base?: number
}

export interface TafData {
  icaoId: string
  issueTime: string
  validTimeFrom: string
  validTimeTo: string
  rawTAF: string
  fcsts: TafForecast[]
}

export interface TafForecast {
  timeFrom: string
  timeTo: string
  changeIndicator?: string
  probability?: number
  wdir?: number | string
  wspd?: number
  wgst?: number
  visib?: string
  wxString?: string
  clouds?: SkyCondition[]
}

export interface SigmetData {
  id: string
  series: string
  issuingCenter: string
  issueTime: string
  validTimeFrom: string
  validTimeTo: string
  rawAirSigmet: string
  hazard: string
  severity?: string
  altitudeLow1?: number
  altitudeHi1?: number
}

export interface AirmetData {
  id: string
  issuingCenter: string
  issueTime: string
  validTimeFrom: string
  validTimeTo: string
  rawAirmet: string
  hazard: string
}

export interface BriefingRequest {
  departure: string
  destination?: string
  altitude?: number
  aircraftType?: string
  departureTime?: string
}

export interface WeatherBundle {
  departureMETAR: MetarData | null
  departureTAF: TafData | null
  destinationMETAR: MetarData | null
  destinationTAF: TafData | null
  sigmets: SigmetData[]
  airmets: AirmetData[]
  fetchedAt: string
}
