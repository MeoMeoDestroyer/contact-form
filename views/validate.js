// value for server sde validation
const validHowDidWeMeet = ['conference', 'networking', 'referral', 'linkedin', 'work', 'other'];
const validEmailFormat = ['html', 'text'];

export function validateContact(body) {
  const errors = [];
  const { firstName, lastName, howDidWeMeet, mailingList, emailFormat } = body;
// first name required
  if (!firstName || !firstName.trim())
    errors.push('First name is required.');
// last name required
  if (!lastName || !lastName.trim())
    errors.push('Last name is required.');
// how did we met must b valid option
  if (!howDidWeMeet || !validHowDidWeMeet.includes(howDidWeMeet))
    errors.push('Please select how we met.');
// if user choose mailing list - must have real email format
  if (mailingList === 'yes') {
    if (!emailFormat || !validEmailFormat.includes(emailFormat))
      errors.push('Please select a valid email format (HTML or Text) for the mailing list.');
  }
// return array of error msg
  return errors;
}