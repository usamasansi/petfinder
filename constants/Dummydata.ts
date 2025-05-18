export interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  lastSeen?: string;
  foundAt?: string;
  age?: string;
  image?: any;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  pets: Pet[];
}


export interface StoreItem {
  id: number;
  name: string;
  price: number;
}

export const users: User[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: '123 Main St, Springfield, IL',
    pets: [
      { id: 1, name: 'Buddy', type: 'Dog', breed: 'Labrador' },
      { id: 2, name: 'Whiskers', type: 'Cat', breed: 'Persian' },
    ],
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '987-654-3210',
    address: '456 Oak Ave, Chicago, IL',
    pets: [],
  },
];

export const lostPets: Pet[] = [
  {
    id: 1,
    name: 'Max',
    type: 'Dog',
    breed: 'Golden Retriever',
    lastSeen: 'Central Park, NY',
  },
];

export const foundPets: Pet[] = [
  {
    id: 1,
    name: 'Unknown',
    type: 'Cat',
    breed: 'Unknown',
    foundAt: 'Downtown, NY',
  },
];

// Pet interface


// Sample data for adoptable pets
export const adoptablePets: Pet[] = [
  {
    id: 1,
    name: 'Luna',
    type: 'Dog',
    breed: 'labrador',
    age: '2 years',
    image: require('../assets/images/dog.jpg')
  },
  {
    id: 2,
    name: 'Milo',
    type: 'Cat',
    breed: 'Ginger ',
    age: '1 year',
    image: require('../assets/images/cat.jpg')
  },
  {
    id: 3,
    name: 'Bella',
    type: 'Dog',
    breed: 'Poodle',
    age: '3 years',
    image: require('../assets/images/dog2.jpg')
  },
];

export const petStoreItems: StoreItem[] = [
  {
    id: 1,
    name: 'Dog Food',
    price: 20,
  },
];
