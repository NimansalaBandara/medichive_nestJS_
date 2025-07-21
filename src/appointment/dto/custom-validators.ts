import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDate', async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(value)) {
      return false;
    }

    const today = new Date();
    const inputDate = new Date(value);
    today.setHours(0, 0, 0, 0);

    return inputDate >= today;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Date must be in the format "YYYY-MM-DD" and not older than today.';
  }
}

@ValidatorConstraint({ name: 'isNonNegativeInteger', async: false })
export class IsNonNegativeIntegerConstraint
  implements ValidatorConstraintInterface
{
  validate(value: number, args: ValidationArguments): boolean {
    return Number.isInteger(value) && value >= 0;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Value must be a non-negative integer.';
  }
}
