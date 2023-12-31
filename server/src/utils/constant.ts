export enum ROLES {
  ADMIN = 1,
  USER = 2,
  TEACHER = 4,
  STUDENT = 3,
}
export enum MAIL_TEMPLATE_ID {
  REGISTER = 'd-db6bbb0802d64247a96775213bf23c48',
}

export enum ASSIGNMENT_STATUS {
  NOT_SUBMITTED = 'NOT_SUBMITTED', // chưa nộp
  SUBMITTED = 'SUBMITTED', // đã nộp
  LATE = 'LATE', // nộp muộn
  GRADED = 'GRADED', // đã chấm điểm
  REQUESTED_REVIEW = 'REQUESTED_REVIEW', // phúc khảo
}

export enum REQUESTED_REVIEW_STATUS {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
}
