export interface Auth {
  id: string;
  name: string;
  username: string;
  password: string;
  hobby: string;
  email: string;
  skillSets: skillSet[];
}

interface skillSet {
  id: string;
  title: string;
  userId: string;
}
