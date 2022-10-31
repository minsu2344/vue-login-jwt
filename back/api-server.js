const express = require('express')
const app = express()
const port = 3000
// HTTPpost put 요청 시 request body에 들어오는 데이터 값을 읽을 수 있는 구문으로 파싱함과 동시에 req.body로 입력해주어 응답 과정에서 요청에 body 프로퍼티를 새로이 쓸 수 있게 해주는 미들웨어
const bodyParser = require('body-parser')
// cookie를 parsing 하는 도구
const cookieParser = require('cookie-parser')
// 보안을 위해 사용하는 토큰
// login 성공 시 jwt에 정보 담아둠
// jwt 사이트 들어가면 decode 다 가능하니까 덜 중요한 정보만 담기
const jwt = require('jsonwebtoken')

const members = [
  {
    id: 3,
    name: 'min',
    loginId: 'min',
    loginPwd: 'gogo'
  },
  {
    id: 4,
    name: 'jin',
    loginId: 'jin',
    loginPwd: 'nono'
  }
]

app.use(cookieParser())
app.use(bodyParser.json())

// jwt 임의의 암호화 key 변수로 저장
const jwtKey = 'abc123'

app.get('/api/account', (req, res) => {
//   // cookie만을 이용해 검증
//   // cookie 여부에 따라 새로고침 해도 로그인 여부 확인
//   if(req.cookies && req.cookies.account) {
//     const member = JSON.parse(req.cookies.account)

//     if(member.id) {
//       return res.send(member);
//     }
//   }
  // jwt를 이용해 검증
  if(req.cookies && req.cookies.token) {
    // verify는 검증 함수
    // 매개변수: 토큰 정보, 암호화 키, err와 decoded된 정보
    jwt.verify(req.cookies.token, jwtKey, (err, decoded) => {
      // error가 있을 때
      if(err) {
        return res.send(401)
      }
      // error가 없을 때 jwt를 decode한 정보 전달
      res.send(decoded)
    })
  }
  // 쿠키가 없다면 401을 줘 로그인 창 뜨도록 함
  res.sendStatus(401);
})

app.post('/api/account', (req, res) => {
  const loginId = req.body.loginId;
  const loginPwd = req.body.loginPwd;

  const member = members.find(member => member.loginId === loginId && member.loginPwd === loginPwd)

  if(member) {
    // jwt에 정보 저장
    // 매개변수: 정보, 임의의 암호화 키, 유효기간&발급자 등 옵션
    const token = jwt.sign({
      id: member.id,
      name: member.name
    }, jwtKey, {
      expiresIn: '15m',
      issuer: 'me'
    })

    // 쿠키에 'account' key로 저장
    // key도 account가 아닌 token으로 변경
    // JSON.stringify(member) 대신 보안에 강한 token 넣어주기
    res.cookie('token', token)
    // front에 member 데이터 전달
    res.send(member)
  }
  else {
    // member가 없으면 404 Not Fount 전달
    res.sendStatus(404)
  }
})

// logout 시 delete
app.delete('/api/account', (req, res) => {
  if(req.cookies && req.cookies.token) res.clearCookie('token')

  res.sendStatus(201)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})