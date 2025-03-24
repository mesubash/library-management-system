 // Mock auth service
export const login = async ({ email, password, role }) => {
    return new Promise(resolve => setTimeout(() => {
      resolve({
        id: 1,
        name: role === 'admin' ? 'Librarian' : 'User',
        email,
        role,
        token: 'mock-token'
      })
    }, 1000))
  }