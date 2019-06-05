import { Feedback } from '../feedback/feedback.model';

export interface Container {
  data: { code: string };
  links: { [id: string]: string };
  errors?: Feedback[];
  infos?: Feedback[];
}
