/*
Frontend pill
 ------------------   decrypt(k)
| salt | encrypted | -----------> pillData
 ------------------
*/

import * as sha256 from 'sha256'
import * as aes256 from 'aes256'
import * as bcrypt from 'bcryptjs'

const saltLength = 29

export const createPill = (
  passwordToEncrypt: string,
  masterPassowrd: string
) => {
  const salt = bcrypt.genSaltSync(14)

  return encryptPill(passwordToEncrypt, getEncryptionKey(masterPassowrd, salt))
}

export const getEncryptionKey = (masterPassword: string, salt: string) =>
  bcrypt.hashSync(masterPassword, salt)

export const decryptPill = (pill, masterPassword) => {
  const salt = pill.slice(0, saltLength)
  const encryptionKey = getEncryptionKey(masterPassword, salt)

  return decryptPillWithKey(pill, encryptionKey)
}

export const decryptPillWithKey = (pill: string, encryptionKey: string) => {
  const encryptedPassword = pill.slice(saltLength)

  const plainPassword = aes256.decrypt(encryptedPassword, encryptionKey)

  return plainPassword
}

export const encryptPill = (plainPassword: string, encryptionKey: string) => {
  const salt = encryptionKey.slice(0, saltLength)
  const encryptedPassword = aes256.encrypt(plainPassword, encryptionKey)

  return salt + encryptedPassword
}

interface HashedCredentials {
  username: string
  password: string
}

export const hashCredentials = (
  username: string,
  masterPassword: string
): HashedCredentials => {
  const salt =
    '$2a$12$' +
    sha256(username + masterPassword)
      .toString()
      .slice(0, 22)

  return {
    // slice -32 because bcrypt store the salt at the begginng of the hash
    // we dont want that
    username: sha256(username).toString().slice(-32),
    password: bcrypt.hashSync(masterPassword, salt),
  }
}
