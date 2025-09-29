# API Documentation

This file lists the application's endpoints, grouped by controller. For each endpoint: HTTP method, path, guards, and validation/DTO notes.

---

## AuthController (prefix: `/auth`)

- POST /auth/login
  - Validation: `LoginDto` via `ZodValidationPipe` (loginSchema)
  - Returns: `{ accessToken }` and sets `refreshToken` cookie (httpOnly)

- POST /auth/refresh
  - Reads `refreshToken` cookie, returns `{ accessToken }` or `{ accessToken: null }`

- POST /auth/register
  - Validation: `RegisterDto` via `ZodValidationPipe` (registerSchema)
  - HttpCode: 201

- GET /auth/me
  - Guards: `AuthenticationGuard`
  - Uses `@UserId()` decorator to get current user id

- POST /auth/logout
  - Guards: `AuthenticationGuard`
  - HttpCode: 201
  - Clears `refreshToken` cookie

---

## UsersController (prefix: `/users`)

- GET /users
  - Returns list of users

- GET /users/:id
  - Returns a single user by id

- GET /users/invitable
  - Guards: `AuthenticationGuard`
  - Returns users that the current user can invite

- DELETE /users
  - Guards: `AuthenticationGuard`, `SelfOrAdminGuard`
  - HttpCode: 204
  - Deletes authenticated user (note: uses `@UserId()` rather than path param)

- GET /users/:id/posts
  - Returns posts for specific user

- PATCH /users/:id
  - Guards: `AuthenticationGuard`
  - Validation: `userUpdateSchema` via `ZodValidationPipe`
  - Body type: `UserUpdateDto`
  - Behavior: upserts `userData` using Prisma `upsert` ({ create, update })

---

## FriendsController (prefix: `/users/:id/friends`)

- GET /users/:id/friends
  - Guards: `AuthenticationGuard`
  - Returns friends for the authenticated user

- DELETE /users/:id/friends/:friendId
  - Guards: `AuthenticationGuard`, `SelfOrAdminGuard`
  - HttpCode: 204
  - Deletes friend relation between authenticated user and `friendId`

---

## InvitesController (prefix: `/invites`)

- GET /invites
  - Guards: `AdminGuard`
  - Returns all invites (admin only)

- POST /invites
  - Guards: `AuthenticationGuard`
  - Validation: `FriendRequestDto` via `ZodValidationPipe`
  - Body: `{ recipentId }` (sender taken from `@UserId()`)

- DELETE /invites/:inviteId
  - Guards: `AuthenticationGuard`
  - HttpCode: 204

- POST /invites/:inviteId/accept
  - Guards: `AuthenticationGuard`
  - Accept invite by id

---

## UserInvitesController (prefix: `/users/:id/invites`)

- GET /users/:id/invites
  - Guards: `AuthenticationGuard`, `SelfOrAdminGuard`
  - Returns invites for the authenticated user

- GET /users/:id/invites/received
  - Guards: `AuthenticationGuard`, `SelfOrAdminGuard`
  - Returns received invites

- GET /users/:id/invites/sent
  - Guards: `AuthenticationGuard`, `SelfOrAdminGuard`
  - Returns sent invites

---

## PostsController (prefix: `/posts`)

- GET /posts
  - Returns list of posts

- GET /posts/:id
  - Returns a single post by id

- POST /posts
  - Guards: `AuthenticationGuard`
  - Validation: `PostDto` via `ZodValidationPipe`
  - Body: `{ content, imageUrl }`
  - Uses `@UserId()` as authorId

- PATCH /posts/:id
  - Guards: `AuthenticationGuard`, `PostAuthorGuard`
  - Validation: `updatePostSchema` via `ZodValidationPipe`

- DELETE /posts/:id
  - Guards: `AuthenticationGuard`, `PostAuthorGuard`

---

## PostCommentsController (prefix: `/posts/:postId/comments`)

- GET /posts/:postId/comments
  - Returns comments for a post

---

## PostLikesController (prefix: `/posts/:postId/likes`)

- GET /posts/:postId/likes
  - Guards: `AuthenticationGuard`

- POST /posts/:postId/likes
  - Guards: `AuthenticationGuard`

- DELETE /posts/:postId/likes
  - Guards: `AuthenticationGuard`

---

## UserPostsController (prefix: `/users/:id/posts`)

- GET /users/:id/posts
  - Returns posts for a specific user

---

## CommentsController (prefix: `/comments`)

- GET /comments
  - Returns all comments

- GET /comments/:id
  - Returns a specific comment

- GET /comments/:id/children
  - Returns sub-comments (children)

- POST /comments
  - Guards: `AuthenticationGuard`
  - Body: `CommentDto` (controller injects `authorId` via `@UserId()`)

---

## CommentLikesController (prefix: `/comments/:id/likes`)

- GET /comments/:id/likes
- POST /comments/:id/likes
- DELETE /comments/:id/likes

---

# Notes & Recommendations

- Several controllers define `:id` in the route but use `@UserId()` (authenticated user) inside methods. Decide whether routes are for arbitrary ids or always for the authenticated user and standardize.
- Consider replacing action endpoints like `/invites/:id/accept` with `PATCH /invites/:id { action: 'accept' }` for better REST semantics.
- Standardize DELETE responses to use 204 No Content where appropriate.
- Document expected request/response shapes (DTOs) in more detail if you want a full OpenAPI spec.

---

Generated from project controllers on ${new Date().toISOString()}.
