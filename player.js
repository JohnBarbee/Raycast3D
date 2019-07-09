class Player{
  constructor(x,y,angle){
    this.pos = createVector(x,y);
    this.angle = angle;
    this.rays = [];
    
    let hFOV = fov * 0.5;
    let fovStep = 0;
    if(res > 1){
      fovStep = fov / (res - 1);
      let sAngle = this.angle - hFOV;
      for(let i = 0; i < res; i++){
        let a = sAngle + (fovStep * i);
        this.rays[i] = a
      }
    } else {
      this.rays[0] = this.angle
    }
  }
  
  rotate(angle){
    this.angle += angle;
  }
  
  move(speed){
    let head = this.heading(this.angle);
    this.pos.x += head.x * speed;
    this.pos.y += head.y * speed;
  }
  
  heading(angle){
    return p5.Vector.fromAngle(radians(angle));
  }
  
  show(){
    push();
    let head = this.heading(this.angle);
    if(debug == false) { background(0); }
    for(let a = 0; a < this.rays.length; a++){
      let r = this.rays[a];
      head = this.heading(this.angle + r);
      let hit = null;
      let record = null;
      for(let wall of walls){
        hit = this.cast(wall, a);
        if(hit != null){
          if(record == null){
            record = hit;
          } else {
            let d1 = dist(this.pos.x, this.pos.y, hit.x, hit.y);
            let d2 = dist(this.pos.x, this.pos.y, record.x, record.y);
            if(d1 < d2){
              //new record
              record = hit;
            }
          }
        }
      }
      if(debug == true){
        if(record != null){
          stroke(0,0,255);
          line(this.pos.x, this.pos.y, record.x, record.y);
        } else {
          stroke(0,255,0);
          line(this.pos.x, this.pos.y,
               this.pos.x + (head.x * 500),
               this.pos.y + (head.y * 500));
        }
        stroke(0);
        fill(255);
        circle(this.pos.x, this.pos.y, 10);
      } else {
        let m = 0;
        if(record != null){
          let d = dist(this.pos.x, this.pos.y, record.x, record.y)
          m = round(viewDist / d) * 5;
          noStroke();
          fill((abs(m)/65) * 255);
        } else {
          noStroke();
          fill(0);
        }
        let top = round((height - m) / 2);
        rect(wStep * a, top, wStep + 1, m); 
      }
    }
    pop();
  }
  
  cast(wall, index) {
    // Checks if the ray intersects with a wall
    // If it does, check where and return the point else return null
    let x1 = wall.point1.x
    let y1 = wall.point1.y
    let x2 = wall.point2.x
    let y2 = wall.point2.y
    
    let head = this.heading(this.angle + this.rays[index]);
    
    let x3 = this.pos.x
    let y3 = this.pos.y
    let x4 = this.pos.x + head.x
    let y4 = this.pos.y + head.y
    
    let den1 = (x1 - x2) * (y3 - y4)
    let den2 = (y1 - y2) * (x3 - x4)
    let den = den1 - den2
    if (den === 0) return null
    
    let t1 = (x1 - x3) * (y3 - y4)
    let t2 = (y1 - y3) * (x3 - x4)
    let t = (t1 - t2) / den
    
    let u1 = (x1 - x2) * (y1 - y3)
    let u2 = (y1 - y2) * (x1 - x3)
    let u = - (u1 - u2) / den
    
    if (t > 0 && t < 1 && u > 0) {
      return createVector(x1 + t * (x2 - x1),
                           y1 + t * (y2 - y1))
    } else {
      return null
    }
  }
}