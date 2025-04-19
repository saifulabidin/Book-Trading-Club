export const validateBook = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.title?.trim()) {
    errors.title = 'Title is required';
  }

  if (!values.author?.trim()) {
    errors.author = 'Author is required';
  }

  if (!values.description?.trim()) {
    errors.description = 'Description is required';
  }

  if (!values.condition) {
    errors.condition = 'Condition is required';
  }

  if (values.publishedYear) {
    const year = parseInt(values.publishedYear);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1000 || year > currentYear) {
      errors.publishedYear = 'Invalid published year';
    }
  }

  if (values.isbn && !/^(?:\d{10}|\d{13})$/.test(values.isbn.replace(/-/g, ''))) {
    errors.isbn = 'Invalid ISBN format';
  }

  return errors;
};

export const validateTradeProposal = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.bookOffered) {
    errors.bookOffered = 'Please select a book to offer';
  }

  if (!values.bookRequested) {
    errors.bookRequested = 'Invalid trade request';
  }

  if (values.message && values.message.length > 500) {
    errors.message = 'Message too long (max 500 characters)';
  }

  return errors;
};

export const validateUserSettings = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.username?.trim()) {
    errors.username = 'Username is required';
  } else if (values.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Invalid email format';
  }

  if (values.fullName && values.fullName.length > 50) {
    errors.fullName = 'Full name too long (max 50 characters)';
  }

  if (values.location && values.location.length > 100) {
    errors.location = 'Location too long (max 100 characters)';
  }

  return errors;
};
