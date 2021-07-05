export class TransactionQueryDto {
  confidenceLevel: number;
  transactionId: string;
}

export class TransactionDto {
  id: string;
  age: number;
  name: string;
  email: string;
  phone: string;
  geoInfo: GeoInfoDto;
  connectionInfo?: ConnectionInfoDto;
  CombinedConnectionInfoDto?: CombinedConnectionInfoDto;
  children?: TransactionDto[];
}

class GeoInfoDto {
  latitude: number;
  longitude: number;
}

class ConnectionInfoDto {
  type: string;
  confidence: number;
}

export class CombinedConnectionInfoDto {
  type: string[];
  confidence: number;
}
