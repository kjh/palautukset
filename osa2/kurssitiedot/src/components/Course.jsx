const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}

const Content = ({parts}) => {
  return (
    <>
        {parts.map(part => 
            <Part key={part.id} part={part.name} exercises={part.exercises}/>
        )}
    </>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part} {props.exercises}
    </p>
  )
}

const Total = ({parts}) => {
  return (
    <p><b>total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises</b></p>
  )
}

const Course = ({course}) => {
    return(
        <>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}

export default Course