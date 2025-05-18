import * as Yup from 'yup';

export const listPetSchema = Yup.object().shape({
  name: Yup.string().required('Pet name is required').min(2, 'Name must be at least 2 characters'),
  type: Yup.string().required('Pet type is required'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  location: Yup.string().required('Location is required'),
  contact: Yup.string().required('Contact info is required').email('Invalid email address'),
  additionalDetails: Yup.string().optional(),
});