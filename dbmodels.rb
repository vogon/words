require 'sequel'

connection_string = ENV['DATABASE_URL']

if connection_string
	DB = Sequel.connect(connection_string)
else
	DB = Sequel.sqlite
end

module Db
	class Poem < Sequel::Model
		one_to_many :lines
	end

	class Line < Sequel::Model
		many_to_one :poem
	end
end

def initialize_models?
	DB.create_table?(:poems) do
		primary_key :id, :integer, :auto_increment => false
		String :title
		String :author

		Integer :haughty
		Integer :naughty
	end

	DB.create_table?(:lines) do
		primary_key :id
		String :text

		foreign_key :poem_id, :poems
		Integer :line_no
	end
end

if $0 == __FILE__ then
	initialize_models?
end