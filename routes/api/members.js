const express = require('express');
const uuid = require('uuid');
const router = express.Router();
let members = require('../../Members');


// Gets all members
router.get('/', (req, res) => res.json(members));

// Gets single member
router.get('/:id', (req, res) => {
    const member = members.find(member => member.id === +req.params.id) || null;
    if (!member) {
        res.status(400).json({ msg: `Member with an id ${req.params.id} not found` });
    }
    res.json(member);
});

// Create member
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        ...req.body,
        status: 'active',
    };

    const invalid = !newMember.name || !newMember.email;
    if (invalid) {
        return res.status(400).json({ msg: 'Please include a name and email' });
    }

    members.push(newMember);
    if (req.headers.origin) {
        return res.redirect('/'); // handle forms direct
    }
    res.json(members); // nost suitable for handlebars view form
});

// Update member
router.put('/:id', (req, res) => {
    let updated = false;
    members = members.map(member => {
        if (!updated && member.id === +req.params.id) {
            updated = {
                ...member,
                ...req.body,
            };
            return updated;
        }

        return member;
    });

    if (updated) {
        return res.json(updated);
    }

    res.status(400).json({ msg: `Unable to edit member with id ${req.params.id}` });
});

// Delete member
router.delete('/:id', (req, res) => {
    let deleted = false;
    members = members.filter(member => {
        if (!deleted && member.id === +req.params.id) {

            deleted = true;
            return false;
        }
        return true;
    });

    if (deleted) {
        return res.json(true);
    }

    res.status(400).json({ msg: `Unable to delete member with id ${req.params.id}` });
});

module.exports = router;