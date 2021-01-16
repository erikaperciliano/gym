const fs = require('fs');
const data = require('./data.json');
const { age, date } =  require('./utils');

exports.show = function(req, res){
    const  { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;
    })

    if(!foundInstructor) return res.send('Instructor not found!');

    

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at)
    }

    return res.render('instructors/show', {instructor});
}

exports.post = function(req, res){
    const keys = Object.keys(req.body);

    for(key of keys){
        if(req.body[key] == "")
            return res.send('Please, fill all fields!')
    }

    let {avatar_url, birth, name, services, gender} = req.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    const id = Number(data.instructors.length + 1);

    

    data.instructors.push({
        avatar_url,
        birth, 
        created_at, 
        id, 
        name, 
        services, 
        gender
    });

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Write file error!')

            return res.redirect('/instructors');
    })

        //return res.send(req.body)
}

exports.edit = function(req, res){
    const  { id } = req.params;

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id;
    })

    if(!foundInstructor) return res.send('Instructor not found!');

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    }

    return res.render('instructors/edit', { instructor });
}