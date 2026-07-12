/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegistrationFormData {
  sscBatch: string;
  fullName: string;
  villageName: string;
  phoneNumber: string;
  occupation: string;
  tShirtSize: string;
  guestCount: string;
  photo?: File | null;
  transactionId: string;
  paymentMethod: string;
}

export const T_SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const GUEST_OPTIONS = [
  'Yes, 1 guest',
  'Yes, 2 guests',
  'Yes, 3 guests',
  'Yes, 4 guests',
  'Yes, 5 guests',
  'Yes, 6 guests',
  'No guests'
];

export const BATCH_YEARS = Array.from({ length: 2024 - 1967 + 1 }, (_, i) => (2024 - i).toString());
