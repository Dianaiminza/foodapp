// const app = require('./index');
// const supertest = require('supertest');
// const request = supertest(app);
// const expect = require("chai").expect;
  
//   describe("POST /multiple", function() {
    
//     it("it should have status code 200 if the file is uploaded", function(done) {
//       request
      
//      .post('/multiple')
//       .attach("file", `${__dirname}//testfiles//health.jpg`)
//       .attach("file", `${__dirname}//testfiles//image.png`)
//       .expect(200)
//       .end(function(err, res){
//         if (err) done(err);
//         done();
//       });
//   });
// });

// describe("POST /multiple", function() {
//   it("it should have status code 200 if the files exist", function(done) {
//     request
//    .post('/multiple')

//       .attach("file", `${__dirname}//testfiles//health.jpg`)
//       .attach("file", `${__dirname}//testfiles//image.png`)
//       .expect(200)
//       .end(function(err, res){
//         if (err) done(err);
//         done();
//       });
//   });
// });
//    describe("POST /multiple", function() {
//    it("it should have status code 200 if the files are of type  png,jpg,jpeg", function(done) {
//     request
//     .post('/multiple')
//     // .attach('file', fs.readFileSync(`${__dirname}/testfiles/health.jpg`))
//     //   .attach('file', fs.readFileSync(`${__dirname}testfiles//image.png`))
//     .attach("file",`${__dirname}//testfiles//health.jpg`)
//     .attach("file", `${__dirname}//testfiles//image.png`)
//       // .attach("file", "C:\Users\Captain\Documents\CV.docx")
      
//       .expect(200)
//       .end(function(err, res){
//         if (err) done(err);
//         done(); 
//       });
//   });
// }); 
// // //change from ubuntu to windows latest