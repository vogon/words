require './dbmodels'

class Poem
	def initialize(id, title, author, lines)
		self.id = id
		self.title = title
		self.author = author
		self.lines = lines

		self.haughty = self.naughty = 0
		self.persisted = nil
	end

	def self.depersist(dbmodel)
		lines = []

		dbmodel.lines.each do |dbline|
			line = dbline.text.split('\n')
			lines[dbline.line_no] = line
		end

		result = Poem.new(dbmodel.id, dbmodel.title, dbmodel.author, lines)
		result.haughty = dbmodel.haughty
		result.naughty = dbmodel.naughty
		result.persisted = dbmodel

		return result
	end

	def persist!
		was_persisted = self.persisted

		if was_persisted
			dbpoem = self.persisted
		else
			dbpoem = Db::Poem.new
			dbpoem.id = self.id
			self.persisted = dbpoem
		end

		dbpoem.title = self.title
		dbpoem.author = self.author
		dbpoem.haughty = self.haughty
		dbpoem.naughty = self.naughty

		dbpoem.save_changes

		# if we haven't been persisted before, create new line records
		if not was_persisted then
			lines.each_with_index do |line, i|
				dbline = Db::Line.new
				dbline.poem = dbpoem
				dbline.text = line.join('\n')
				dbline.line_no = i
				dbline.save
			end
		end
	end

	def to_json(options = {})
		JSON.dump(self.lines)
	end

	attr_accessor :id
	attr_accessor :title
	attr_accessor :author

	attr_accessor :haughty
	attr_accessor :naughty

	attr_accessor :lines

	attr_accessor :persisted
end