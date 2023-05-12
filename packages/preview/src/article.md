```ts
class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  hello() {
    console.log(`Hello, ${this.name}!`)
  }
}

const p = new Person('Ziu', 18)
p.hello() // Hello, Ziu!
```
