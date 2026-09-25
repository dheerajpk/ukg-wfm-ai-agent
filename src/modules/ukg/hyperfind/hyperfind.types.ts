// Represents the UKG API response from executing a Hyperfind query.
// Contains the total count of results and the detailed result set.
export type ExecuteHyperfindResponse = {
  count: number;
  result: HyperfindResult;
};

export type HyperfindResult = {
  refs: PersonReference[];
  basePersons: BasePerson[];
};

export type PersonReference = {
  id: number;
  qualifier: string;
};

export type BasePerson = {
  personId: number;
  personNumber: string;
  fullName: string;
  displayName: string;
};
