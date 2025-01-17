import { StatusEnum } from '../../types/reports';

export const checkIsValidStatus = (value: any): value is StatusEnum => {
    return Object.values(StatusEnum).includes(value);
};
