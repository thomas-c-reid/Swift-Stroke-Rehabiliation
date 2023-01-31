import datetime as dt
from marshmallow import Schema, fields, post_load

# The game scores class 
class gameScores:
    def __init__(self, user_Id, accuracy, timeTaken, level, explanation, difficulty, dateAddedToDb):
        self.user_Id = user_Id
        self.accuracy = accuracy
        self.timeTaken = timeTaken
        self.level = level
        self.explanation = explanation
        self.difficulty = difficulty
        self.dateAddedToDb = dateAddedToDb

    def __repr__(self):
        return "<gameScores(user_Id={self.user_Id!r})>".format(self=self)


class gameScoresSchema(Schema):
    user_Id = fields.Int()
    accuracy = fields.Int()
    timeTaken = fields.Int()
    level = fields.Int()
    explanation = fields.String()
    difficulty = fields.Int()
    dateAddedToDb = fields.DateTime("%d/%m/%Y")


    @post_load
    def make_gameScores(self, data, **kwargs):
        return gameScores(**data)



